;; =============================================
;; STACKS FUND -- Milestone Tracker Contract
;; =============================================
;; A fully barrier-free milestone tracking and accountability system.
;; Any wallet can create milestones, submit evidence, vote to approve,
;; and trigger fund releases based on community verification.
;; Designed to work alongside crowdfunding campaigns for full accountability.
;; No admin gates. No minimum votes. Open community verification.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant ERR-MILESTONE-NOT-FOUND (err u300))
(define-constant ERR-NOT-CREATOR (err u302))
(define-constant ERR-INVALID-STATUS (err u303))
(define-constant ERR-ALREADY-VOTED (err u304))
(define-constant ERR-SELF-APPROVE (err u305))
(define-constant ERR-EMPTY-DESCRIPTION (err u306))
(define-constant ERR-EMPTY-EVIDENCE (err u310))

;; Milestone status
(define-constant STATUS-PENDING u0)
(define-constant STATUS-IN-PROGRESS u1)
(define-constant STATUS-SUBMITTED u2)
(define-constant STATUS-APPROVED u3)
(define-constant STATUS-REJECTED u4)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-data-var total-milestones uint u0)
(define-data-var total-approved uint u0)
(define-data-var total-rejected uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map milestones { campaign-id: uint, milestone-id: uint }
  {
    creator: principal,
    description: (string-ascii 256),
    amount-release: uint,
    status: uint,
    evidence-hash: (optional (buff 32)),
    evidence-description: (optional (string-ascii 256)),
    approvals: uint,
    rejections: uint,
    approval-threshold: uint,
    created-at: uint,
    submitted-at: (optional uint),
    resolved-at: (optional uint),
    funds-released: bool
  }
)

;; Track milestone count per campaign
(define-map campaign-milestone-count uint uint)

;; Track who has voted on each milestone
(define-map milestone-votes { campaign-id: uint, milestone-id: uint, voter: principal }
  {
    approved: bool,
    voted-at: uint
  }
)

;; Track reviewer stats
(define-map reviewer-stats principal
  {
    milestones-reviewed: uint,
    approvals-given: uint,
    rejections-given: uint
  }
)

;; -----------------------------------------------
;; Public Functions -- ALL BARRIER-FREE
;; -----------------------------------------------

;; Add a milestone to a campaign -- any wallet can create milestones
;; amount-release: STX to release on approval (tracked, not held here)
;; approval-threshold: number of approvals needed (u0 defaults to u3)
(define-public (add-milestone
    (campaign-id uint)
    (description (string-ascii 256))
    (amount-release uint)
    (approval-threshold uint)
  )
  (let (
    (current-count (default-to u0 (map-get? campaign-milestone-count campaign-id)))
    (milestone-id (+ current-count u1))
    (effective-threshold (if (> approval-threshold u0) approval-threshold u3))
  )
    (asserts! (> (len description) u0) ERR-EMPTY-DESCRIPTION)

    (map-set milestones { campaign-id: campaign-id, milestone-id: milestone-id } {
      creator: tx-sender,
      description: description,
      amount-release: amount-release,
      status: STATUS-PENDING,
      evidence-hash: none,
      evidence-description: none,
      approvals: u0,
      rejections: u0,
      approval-threshold: effective-threshold,
      created-at: stacks-block-height,
      submitted-at: none,
      resolved-at: none,
      funds-released: false
    })

    (map-set campaign-milestone-count campaign-id milestone-id)
    (var-set total-milestones (+ (var-get total-milestones) u1))

    (print {
      event: "milestone-added",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      creator: tx-sender,
      amount-release: amount-release,
      threshold: effective-threshold
    })
    (ok milestone-id)
  )
)

;; Start work on a milestone -- milestone creator moves it to in-progress
(define-public (start-milestone (campaign-id uint) (milestone-id uint))
  (let (
    (milestone (unwrap! (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id }) ERR-MILESTONE-NOT-FOUND))
  )
    (asserts! (is-eq (get status milestone) STATUS-PENDING) ERR-INVALID-STATUS)
    (asserts! (is-eq (get creator milestone) tx-sender) ERR-NOT-CREATOR)

    (map-set milestones { campaign-id: campaign-id, milestone-id: milestone-id }
      (merge milestone { status: STATUS-IN-PROGRESS })
    )

    (print {
      event: "milestone-started",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      creator: tx-sender
    })
    (ok true)
  )
)

;; Submit evidence of completion -- milestone creator provides proof
(define-public (submit-evidence
    (campaign-id uint)
    (milestone-id uint)
    (evidence-hash (buff 32))
    (evidence-desc (string-ascii 256))
  )
  (let (
    (milestone (unwrap! (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id }) ERR-MILESTONE-NOT-FOUND))
  )
    (asserts! (is-eq (get creator milestone) tx-sender) ERR-NOT-CREATOR)
    (asserts! (is-eq (get status milestone) STATUS-IN-PROGRESS) ERR-INVALID-STATUS)
    (asserts! (> (len evidence-desc) u0) ERR-EMPTY-EVIDENCE)

    (map-set milestones { campaign-id: campaign-id, milestone-id: milestone-id }
      (merge milestone {
        status: STATUS-SUBMITTED,
        evidence-hash: (some evidence-hash),
        evidence-description: (some evidence-desc),
        submitted-at: (some stacks-block-height)
      })
    )

    (print {
      event: "evidence-submitted",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      evidence-hash: evidence-hash,
      creator: tx-sender
    })
    (ok true)
  )
)

;; Approve a milestone -- any wallet can vote to approve (except milestone creator)
;; Each wallet can only vote once per milestone
(define-public (approve-milestone (campaign-id uint) (milestone-id uint))
  (let (
    (milestone (unwrap! (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id }) ERR-MILESTONE-NOT-FOUND))
    (already-voted (is-some (map-get? milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: tx-sender })))
  )
    (asserts! (is-eq (get status milestone) STATUS-SUBMITTED) ERR-INVALID-STATUS)
    (asserts! (not already-voted) ERR-ALREADY-VOTED)
    (asserts! (not (is-eq (get creator milestone) tx-sender)) ERR-SELF-APPROVE)

    ;; Record vote
    (map-set milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: tx-sender } {
      approved: true,
      voted-at: stacks-block-height
    })

    (let ((new-approvals (+ (get approvals milestone) u1)))
      ;; Auto-approve if threshold met
      (map-set milestones { campaign-id: campaign-id, milestone-id: milestone-id }
        (merge milestone {
          approvals: new-approvals,
          status: (if (>= new-approvals (get approval-threshold milestone)) STATUS-APPROVED STATUS-SUBMITTED),
          resolved-at: (if (>= new-approvals (get approval-threshold milestone)) (some stacks-block-height) none)
        })
      )

      (if (>= new-approvals (get approval-threshold milestone))
        (var-set total-approved (+ (var-get total-approved) u1))
        true
      )
    )

    ;; Update reviewer stats
    (let ((stats (default-to { milestones-reviewed: u0, approvals-given: u0, rejections-given: u0 }
                    (map-get? reviewer-stats tx-sender))))
      (map-set reviewer-stats tx-sender (merge stats {
        milestones-reviewed: (+ (get milestones-reviewed stats) u1),
        approvals-given: (+ (get approvals-given stats) u1)
      }))
    )

    (print {
      event: "milestone-approved-vote",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      voter: tx-sender,
      total-approvals: (+ (get approvals milestone) u1)
    })
    (ok true)
  )
)

;; Reject a milestone -- any wallet can vote to reject (except milestone creator)
(define-public (reject-milestone (campaign-id uint) (milestone-id uint))
  (let (
    (milestone (unwrap! (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id }) ERR-MILESTONE-NOT-FOUND))
    (already-voted (is-some (map-get? milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: tx-sender })))
  )
    (asserts! (is-eq (get status milestone) STATUS-SUBMITTED) ERR-INVALID-STATUS)
    (asserts! (not already-voted) ERR-ALREADY-VOTED)
    (asserts! (not (is-eq (get creator milestone) tx-sender)) ERR-SELF-APPROVE)

    (map-set milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: tx-sender } {
      approved: false,
      voted-at: stacks-block-height
    })

    (let ((new-rejections (+ (get rejections milestone) u1)))
      ;; Auto-reject if rejections >= threshold
      (map-set milestones { campaign-id: campaign-id, milestone-id: milestone-id }
        (merge milestone {
          rejections: new-rejections,
          status: (if (>= new-rejections (get approval-threshold milestone)) STATUS-REJECTED STATUS-SUBMITTED),
          resolved-at: (if (>= new-rejections (get approval-threshold milestone)) (some stacks-block-height) none)
        })
      )

      (if (>= new-rejections (get approval-threshold milestone))
        (var-set total-rejected (+ (var-get total-rejected) u1))
        true
      )
    )

    ;; Update reviewer stats
    (let ((stats (default-to { milestones-reviewed: u0, approvals-given: u0, rejections-given: u0 }
                    (map-get? reviewer-stats tx-sender))))
      (map-set reviewer-stats tx-sender (merge stats {
        milestones-reviewed: (+ (get milestones-reviewed stats) u1),
        rejections-given: (+ (get rejections-given stats) u1)
      }))
    )

    (print {
      event: "milestone-rejected-vote",
      campaign-id: campaign-id,
      milestone-id: milestone-id,
      voter: tx-sender,
      total-rejections: (+ (get rejections milestone) u1)
    })
    (ok true)
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-milestone (campaign-id uint) (milestone-id uint))
  (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id })
)

(define-read-only (get-milestone-count (campaign-id uint))
  (default-to u0 (map-get? campaign-milestone-count campaign-id))
)

(define-read-only (get-vote (campaign-id uint) (milestone-id uint) (voter principal))
  (map-get? milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: voter })
)

(define-read-only (has-voted-on-milestone (campaign-id uint) (milestone-id uint) (voter principal))
  (is-some (map-get? milestone-votes { campaign-id: campaign-id, milestone-id: milestone-id, voter: voter }))
)

(define-read-only (get-reviewer-stats-info (reviewer principal))
  (default-to { milestones-reviewed: u0, approvals-given: u0, rejections-given: u0 }
    (map-get? reviewer-stats reviewer))
)

(define-read-only (get-milestone-tracker-stats)
  {
    total-milestones: (var-get total-milestones),
    total-approved: (var-get total-approved),
    total-rejected: (var-get total-rejected)
  }
)

;; Clarity 4: to-ascii? for human-readable milestone info
(define-read-only (get-milestone-summary (campaign-id uint) (milestone-id uint))
  (match (map-get? milestones { campaign-id: campaign-id, milestone-id: milestone-id })
    milestone (let (
      (approvals-ascii (match (to-ascii? (get approvals milestone)) ok-val ok-val err "0"))
      (rejections-ascii (match (to-ascii? (get rejections milestone)) ok-val ok-val err "0"))
      (threshold-ascii (match (to-ascii? (get approval-threshold milestone)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status milestone) STATUS-PENDING) "PENDING"
        (if (is-eq (get status milestone) STATUS-IN-PROGRESS) "IN_PROGRESS"
        (if (is-eq (get status milestone) STATUS-SUBMITTED) "SUBMITTED"
        (if (is-eq (get status milestone) STATUS-APPROVED) "APPROVED"
        "REJECTED")))))
    )
      (ok {
        description: (get description milestone),
        status: status-str,
        approvals: approvals-ascii,
        rejections: rejections-ascii,
        threshold: threshold-ascii,
        has-evidence: (is-some (get evidence-hash milestone)),
        funds-released: (get funds-released milestone)
      })
    )
    ERR-MILESTONE-NOT-FOUND
  )
)
