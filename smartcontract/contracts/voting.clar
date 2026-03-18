;; =============================================
;; STACKS FUND -- Voting & Governance Contract
;; =============================================
;; A fully barrier-free governance system on Bitcoin L2.
;; Any wallet can create proposals, vote on them, and finalize results.
;; No admin gates. No token-gating. No minimum stake. Pure open governance.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant ERR-PROPOSAL-NOT-FOUND (err u100))
(define-constant ERR-PROPOSAL-NOT-ACTIVE (err u101))
(define-constant ERR-PROPOSAL-STILL-ACTIVE (err u102))
(define-constant ERR-ALREADY-VOTED (err u103))
(define-constant ERR-EMPTY-TITLE (err u104))
(define-constant ERR-EMPTY-DESCRIPTION (err u105))
(define-constant ERR-INVALID-DURATION (err u106))
(define-constant ERR-ALREADY-FINALIZED (err u107))
(define-constant ERR-NOT-CREATOR (err u108))

;; Status
(define-constant STATUS-ACTIVE u0)
(define-constant STATUS-PASSED u1)
(define-constant STATUS-REJECTED u2)
(define-constant STATUS-CANCELLED u3)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-data-var proposal-counter uint u0)
(define-data-var total-votes-cast uint u0)
(define-data-var total-proposals-passed uint u0)
(define-data-var total-proposals-rejected uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map proposals uint
  {
    creator: principal,
    title: (string-ascii 64),
    description: (string-ascii 256),
    category: (string-ascii 32),
    yes-votes: uint,
    no-votes: uint,
    abstain-votes: uint,
    created-at: uint,
    end-block: uint,
    quorum: uint,
    status: uint,
    total-voters: uint
  }
)

;; Track individual votes (prevents double-voting)
(define-map has-voted { proposal-id: uint, voter: principal } bool)

;; Track vote choice per voter (for transparency)
(define-map vote-records { proposal-id: uint, voter: principal }
  {
    support: uint,
    voted-at: uint
  }
)

;; Track voter participation stats
(define-map voter-stats principal
  {
    proposals-created: uint,
    votes-cast: uint,
    proposals-passed: uint
  }
)

;; Vote choice constants for vote-records
;; u0 = no, u1 = yes, u2 = abstain

;; -----------------------------------------------
;; Public Functions -- ALL BARRIER-FREE
;; -----------------------------------------------

;; Create a proposal -- any wallet can call
;; quorum: minimum total votes needed to finalize (u0 defaults to u1)
(define-public (create-proposal
    (title (string-ascii 64))
    (description (string-ascii 256))
    (category (string-ascii 32))
    (duration-blocks uint)
    (quorum uint)
  )
  (let (
    (proposal-id (+ (var-get proposal-counter) u1))
    (end-block (+ stacks-block-height duration-blocks))
    (effective-quorum (if (> quorum u0) quorum u1))
  )
    (asserts! (> (len title) u0) ERR-EMPTY-TITLE)
    (asserts! (> (len description) u0) ERR-EMPTY-DESCRIPTION)
    (asserts! (> duration-blocks u0) ERR-INVALID-DURATION)

    (map-set proposals proposal-id {
      creator: tx-sender,
      title: title,
      description: description,
      category: category,
      yes-votes: u0,
      no-votes: u0,
      abstain-votes: u0,
      created-at: stacks-block-height,
      end-block: end-block,
      quorum: effective-quorum,
      status: STATUS-ACTIVE,
      total-voters: u0
    })

    ;; Update voter stats
    (let ((stats (default-to { proposals-created: u0, votes-cast: u0, proposals-passed: u0 }
                    (map-get? voter-stats tx-sender))))
      (map-set voter-stats tx-sender (merge stats {
        proposals-created: (+ (get proposals-created stats) u1)
      }))
    )

    (var-set proposal-counter proposal-id)
    (print {
      event: "proposal-created",
      proposal-id: proposal-id,
      creator: tx-sender,
      title: title,
      category: category,
      end-block: end-block,
      quorum: effective-quorum
    })
    (ok proposal-id)
  )
)

;; Vote on a proposal -- any wallet can call
;; support: true = yes, false = no
(define-public (vote (proposal-id uint) (support bool))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
  )
    (asserts! (is-eq (get status proposal) STATUS-ACTIVE) ERR-PROPOSAL-NOT-ACTIVE)
    (asserts! (< stacks-block-height (get end-block proposal)) ERR-PROPOSAL-STILL-ACTIVE)
    (asserts! (is-none (map-get? has-voted { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)

    ;; Record vote
    (map-set has-voted { proposal-id: proposal-id, voter: tx-sender } true)
    (map-set vote-records { proposal-id: proposal-id, voter: tx-sender } {
      support: (if support u1 u0),
      voted-at: stacks-block-height
    })

    ;; Update proposal tallies
    (if support
      (map-set proposals proposal-id (merge proposal {
        yes-votes: (+ (get yes-votes proposal) u1),
        total-voters: (+ (get total-voters proposal) u1)
      }))
      (map-set proposals proposal-id (merge proposal {
        no-votes: (+ (get no-votes proposal) u1),
        total-voters: (+ (get total-voters proposal) u1)
      }))
    )

    ;; Update voter stats
    (let ((stats (default-to { proposals-created: u0, votes-cast: u0, proposals-passed: u0 }
                    (map-get? voter-stats tx-sender))))
      (map-set voter-stats tx-sender (merge stats {
        votes-cast: (+ (get votes-cast stats) u1)
      }))
    )

    (var-set total-votes-cast (+ (var-get total-votes-cast) u1))
    (print {
      event: "vote-cast",
      proposal-id: proposal-id,
      voter: tx-sender,
      support: support
    })
    (ok true)
  )
)

;; Vote abstain -- any wallet can call (counts toward quorum but not yes/no)
(define-public (vote-abstain (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
  )
    (asserts! (is-eq (get status proposal) STATUS-ACTIVE) ERR-PROPOSAL-NOT-ACTIVE)
    (asserts! (< stacks-block-height (get end-block proposal)) ERR-PROPOSAL-STILL-ACTIVE)
    (asserts! (is-none (map-get? has-voted { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)

    (map-set has-voted { proposal-id: proposal-id, voter: tx-sender } true)
    (map-set vote-records { proposal-id: proposal-id, voter: tx-sender } {
      support: u2,
      voted-at: stacks-block-height
    })

    (map-set proposals proposal-id (merge proposal {
      abstain-votes: (+ (get abstain-votes proposal) u1),
      total-voters: (+ (get total-voters proposal) u1)
    }))

    (var-set total-votes-cast (+ (var-get total-votes-cast) u1))
    (print {
      event: "vote-abstain",
      proposal-id: proposal-id,
      voter: tx-sender
    })
    (ok true)
  )
)

;; Finalize a proposal after voting ends -- any wallet can trigger
(define-public (finalize-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
  )
    (asserts! (is-eq (get status proposal) STATUS-ACTIVE) ERR-ALREADY-FINALIZED)
    (asserts! (>= stacks-block-height (get end-block proposal)) ERR-PROPOSAL-STILL-ACTIVE)

    (let (
      (quorum-met (>= (get total-voters proposal) (get quorum proposal)))
      (majority-yes (> (get yes-votes proposal) (get no-votes proposal)))
      (passed (and quorum-met majority-yes))
      (new-status (if passed STATUS-PASSED STATUS-REJECTED))
    )
      (map-set proposals proposal-id (merge proposal { status: new-status }))

      (if passed
        (begin
          (var-set total-proposals-passed (+ (var-get total-proposals-passed) u1))
          ;; Update creator stats
          (let ((stats (default-to { proposals-created: u0, votes-cast: u0, proposals-passed: u0 }
                        (map-get? voter-stats (get creator proposal)))))
            (map-set voter-stats (get creator proposal) (merge stats {
              proposals-passed: (+ (get proposals-passed stats) u1)
            }))
          )
        )
        (var-set total-proposals-rejected (+ (var-get total-proposals-rejected) u1))
      )

      (print {
        event: "proposal-finalized",
        proposal-id: proposal-id,
        status: new-status,
        yes-votes: (get yes-votes proposal),
        no-votes: (get no-votes proposal),
        abstain-votes: (get abstain-votes proposal),
        quorum-met: quorum-met
      })
      (ok passed)
    )
  )
)

;; Cancel a proposal -- creator only, only while active
(define-public (cancel-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
  )
    (asserts! (is-eq (get creator proposal) tx-sender) ERR-NOT-CREATOR)
    (asserts! (is-eq (get status proposal) STATUS-ACTIVE) ERR-ALREADY-FINALIZED)

    (map-set proposals proposal-id (merge proposal { status: STATUS-CANCELLED }))
    (print {
      event: "proposal-cancelled",
      proposal-id: proposal-id,
      creator: tx-sender
    })
    (ok true)
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id)
)

(define-read-only (has-user-voted (proposal-id uint) (voter principal))
  (is-some (map-get? has-voted { proposal-id: proposal-id, voter: voter }))
)

(define-read-only (get-vote-record (proposal-id uint) (voter principal))
  (map-get? vote-records { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-voter-stats-info (voter principal))
  (default-to { proposals-created: u0, votes-cast: u0, proposals-passed: u0 }
    (map-get? voter-stats voter))
)

(define-read-only (get-total-proposals)
  (var-get proposal-counter)
)

(define-read-only (get-governance-stats)
  {
    total-proposals: (var-get proposal-counter),
    total-votes: (var-get total-votes-cast),
    proposals-passed: (var-get total-proposals-passed),
    proposals-rejected: (var-get total-proposals-rejected)
  }
)

;; Clarity 4: to-ascii? for human-readable proposal info
(define-read-only (get-proposal-summary (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (let (
      (yes-ascii (match (to-ascii? (get yes-votes proposal)) ok-val ok-val err "0"))
      (no-ascii (match (to-ascii? (get no-votes proposal)) ok-val ok-val err "0"))
      (abstain-ascii (match (to-ascii? (get abstain-votes proposal)) ok-val ok-val err "0"))
      (voters-ascii (match (to-ascii? (get total-voters proposal)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status proposal) STATUS-ACTIVE) "ACTIVE"
        (if (is-eq (get status proposal) STATUS-PASSED) "PASSED"
        (if (is-eq (get status proposal) STATUS-REJECTED) "REJECTED"
        "CANCELLED"))))
    )
      (ok {
        title: (get title proposal),
        category: (get category proposal),
        yes-votes: yes-ascii,
        no-votes: no-ascii,
        abstain-votes: abstain-ascii,
        total-voters: voters-ascii,
        status: status-str
      })
    )
    ERR-PROPOSAL-NOT-FOUND
  )
)
