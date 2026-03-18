;; =============================================
;; STACKS FUND -- Crowdfunding Campaign Contract
;; =============================================
;; A fully barrier-free crowdfunding system on Bitcoin L2.
;; Any wallet can create campaigns, contribute, withdraw funds, or claim refunds.
;; Auto-status on goal reached. Full refund if campaign fails.
;; No admin gates. No minimum contributions. Open community funding.
;; Clarity 4 | Nakamoto | Epoch 3.3

;; -----------------------------------------------
;; Constants
;; -----------------------------------------------
(define-constant ERR-CAMPAIGN-NOT-FOUND (err u200))
(define-constant ERR-NOT-CREATOR (err u201))
(define-constant ERR-CAMPAIGN-NOT-ACTIVE (err u202))
(define-constant ERR-CAMPAIGN-EXPIRED (err u203))
(define-constant ERR-INVALID-GOAL (err u204))
(define-constant ERR-ZERO-CONTRIBUTION (err u205))
(define-constant ERR-CAMPAIGN-NOT-FAILED (err u206))
(define-constant ERR-NO-CONTRIBUTION (err u207))
(define-constant ERR-FUNDS-ALREADY-WITHDRAWN (err u208))
(define-constant ERR-CAMPAIGN-NOT-SUCCESSFUL (err u209))
(define-constant ERR-INVALID-DURATION (err u210))
(define-constant ERR-EMPTY-TITLE (err u211))
(define-constant ERR-EMPTY-DESCRIPTION (err u212))
(define-constant ERR-CAMPAIGN-ALREADY-ENDED (err u213))

;; Status
(define-constant STATUS-ACTIVE u0)
(define-constant STATUS-SUCCESSFUL u1)
(define-constant STATUS-FAILED u2)
(define-constant STATUS-CANCELLED u3)

;; -----------------------------------------------
;; Data Variables
;; -----------------------------------------------
(define-constant CONTRACT-ADDRESS .crowdfunding-campaign)
(define-data-var campaign-counter uint u0)
(define-data-var total-raised uint u0)
(define-data-var total-campaigns-funded uint u0)
(define-data-var total-refunds-issued uint u0)

;; -----------------------------------------------
;; Maps
;; -----------------------------------------------
(define-map campaigns uint
  {
    creator: principal,
    title: (string-ascii 64),
    description: (string-ascii 256),
    category: (string-ascii 32),
    goal: uint,
    raised: uint,
    deadline-block: uint,
    status: uint,
    funds-withdrawn: bool,
    contributor-count: uint,
    created-at: uint
  }
)

;; Track individual contributions
(define-map contributions { campaign-id: uint, contributor: principal } uint)

;; Track contributor index for enumeration
(define-map campaign-contributors { campaign-id: uint, index: uint } principal)

;; Track backer stats
(define-map backer-stats principal
  {
    campaigns-backed: uint,
    total-contributed: uint,
    total-refunded: uint
  }
)

;; Track creator stats
(define-map creator-stats principal
  {
    campaigns-created: uint,
    campaigns-funded: uint,
    total-raised: uint
  }
)

;; -----------------------------------------------
;; Public Functions -- ALL BARRIER-FREE
;; -----------------------------------------------

;; Create a campaign -- any wallet can call
;; goal: target amount in microSTX (even u1 is valid)
(define-public (create-campaign
    (title (string-ascii 64))
    (description (string-ascii 256))
    (category (string-ascii 32))
    (goal uint)
    (duration-blocks uint)
  )
  (let (
    (campaign-id (+ (var-get campaign-counter) u1))
    (deadline (+ stacks-block-height duration-blocks))
  )
    (asserts! (> (len title) u0) ERR-EMPTY-TITLE)
    (asserts! (> (len description) u0) ERR-EMPTY-DESCRIPTION)
    (asserts! (> goal u0) ERR-INVALID-GOAL)
    (asserts! (> duration-blocks u0) ERR-INVALID-DURATION)

    (map-set campaigns campaign-id {
      creator: tx-sender,
      title: title,
      description: description,
      category: category,
      goal: goal,
      raised: u0,
      deadline-block: deadline,
      status: STATUS-ACTIVE,
      funds-withdrawn: false,
      contributor-count: u0,
      created-at: stacks-block-height
    })

    ;; Update creator stats
    (let ((stats (default-to { campaigns-created: u0, campaigns-funded: u0, total-raised: u0 }
                    (map-get? creator-stats tx-sender))))
      (map-set creator-stats tx-sender (merge stats {
        campaigns-created: (+ (get campaigns-created stats) u1)
      }))
    )

    (var-set campaign-counter campaign-id)
    (print {
      event: "campaign-created",
      campaign-id: campaign-id,
      creator: tx-sender,
      goal: goal,
      deadline-block: deadline,
      category: category
    })
    (ok campaign-id)
  )
)

;; Contribute to a campaign -- any wallet can call
;; amount: in microSTX (even u1 is valid)
(define-public (contribute (campaign-id uint) (amount uint))
  (let (
    (campaign (unwrap! (map-get? campaigns campaign-id) ERR-CAMPAIGN-NOT-FOUND))
    (existing (default-to u0 (map-get? contributions { campaign-id: campaign-id, contributor: tx-sender })))
    (is-new-backer (is-eq existing u0))
    (current-count (get contributor-count campaign))
  )
    (asserts! (> amount u0) ERR-ZERO-CONTRIBUTION)
    (asserts! (is-eq (get status campaign) STATUS-ACTIVE) ERR-CAMPAIGN-NOT-ACTIVE)
    (asserts! (< stacks-block-height (get deadline-block campaign)) ERR-CAMPAIGN-EXPIRED)

    ;; Transfer STX to contract
    (try! (stx-transfer? amount tx-sender CONTRACT-ADDRESS))

    ;; Track contribution
    (map-set contributions { campaign-id: campaign-id, contributor: tx-sender } (+ existing amount))

    ;; If new backer, add to index
    (if is-new-backer
      (begin
        (map-set campaign-contributors { campaign-id: campaign-id, index: current-count } tx-sender)
        (map-set campaigns campaign-id (merge campaign {
          raised: (+ (get raised campaign) amount),
          contributor-count: (+ current-count u1),
          status: (if (>= (+ (get raised campaign) amount) (get goal campaign)) STATUS-SUCCESSFUL (get status campaign))
        }))
      )
      (map-set campaigns campaign-id (merge campaign {
        raised: (+ (get raised campaign) amount),
        status: (if (>= (+ (get raised campaign) amount) (get goal campaign)) STATUS-SUCCESSFUL (get status campaign))
      }))
    )

    ;; Update backer stats
    (let ((stats (default-to { campaigns-backed: u0, total-contributed: u0, total-refunded: u0 }
                    (map-get? backer-stats tx-sender))))
      (map-set backer-stats tx-sender (merge stats {
        campaigns-backed: (if is-new-backer (+ (get campaigns-backed stats) u1) (get campaigns-backed stats)),
        total-contributed: (+ (get total-contributed stats) amount)
      }))
    )

    (var-set total-raised (+ (var-get total-raised) amount))
    (print {
      event: "contribution-made",
      campaign-id: campaign-id,
      contributor: tx-sender,
      amount: amount,
      total-raised: (+ (get raised campaign) amount)
    })
    (ok true)
  )
)

;; Withdraw funds -- creator claims after campaign succeeds
(define-public (withdraw-funds (campaign-id uint))
  (let (
    (campaign (unwrap! (map-get? campaigns campaign-id) ERR-CAMPAIGN-NOT-FOUND))
    (amount (get raised campaign))
  )
    (asserts! (is-eq (get status campaign) STATUS-SUCCESSFUL) ERR-CAMPAIGN-NOT-SUCCESSFUL)
    (asserts! (not (get funds-withdrawn campaign)) ERR-FUNDS-ALREADY-WITHDRAWN)

    (map-set campaigns campaign-id (merge campaign { funds-withdrawn: true }))
    (try! (stx-transfer? amount CONTRACT-ADDRESS (get creator campaign)))

    ;; Update creator stats
    (let ((stats (default-to { campaigns-created: u0, campaigns-funded: u0, total-raised: u0 }
                    (map-get? creator-stats (get creator campaign)))))
      (map-set creator-stats (get creator campaign) (merge stats {
        campaigns-funded: (+ (get campaigns-funded stats) u1),
        total-raised: (+ (get total-raised stats) amount)
      }))
    )

    (var-set total-campaigns-funded (+ (var-get total-campaigns-funded) u1))
    (print {
      event: "funds-withdrawn",
      campaign-id: campaign-id,
      creator: (get creator campaign),
      amount: amount
    })
    (ok amount)
  )
)

;; Claim refund -- backer reclaims if campaign failed or expired without reaching goal
(define-public (claim-refund (campaign-id uint))
  (let (
    (campaign (unwrap! (map-get? campaigns campaign-id) ERR-CAMPAIGN-NOT-FOUND))
    (contribution (unwrap! (map-get? contributions { campaign-id: campaign-id, contributor: tx-sender }) ERR-NO-CONTRIBUTION))
  )
    ;; Refund allowed if: explicitly failed, cancelled, or expired without reaching goal
    (asserts! (or
      (is-eq (get status campaign) STATUS-FAILED)
      (is-eq (get status campaign) STATUS-CANCELLED)
      (and
        (is-eq (get status campaign) STATUS-ACTIVE)
        (>= stacks-block-height (get deadline-block campaign))
        (< (get raised campaign) (get goal campaign))
      )
    ) ERR-CAMPAIGN-NOT-FAILED)

    ;; Delete contribution to prevent double-refund
    (map-delete contributions { campaign-id: campaign-id, contributor: tx-sender })
    (try! (stx-transfer? contribution CONTRACT-ADDRESS tx-sender))

    ;; Update backer stats
    (let ((stats (default-to { campaigns-backed: u0, total-contributed: u0, total-refunded: u0 }
                    (map-get? backer-stats tx-sender))))
      (map-set backer-stats tx-sender (merge stats {
        total-refunded: (+ (get total-refunded stats) contribution)
      }))
    )

    (var-set total-refunds-issued (+ (var-get total-refunds-issued) u1))
    (print {
      event: "refund-claimed",
      campaign-id: campaign-id,
      contributor: tx-sender,
      amount: contribution
    })
    (ok contribution)
  )
)

;; Cancel campaign -- creator only, only while active
(define-public (cancel-campaign (campaign-id uint))
  (let (
    (campaign (unwrap! (map-get? campaigns campaign-id) ERR-CAMPAIGN-NOT-FOUND))
  )
    (asserts! (is-eq (get creator campaign) tx-sender) ERR-NOT-CREATOR)
    (asserts! (is-eq (get status campaign) STATUS-ACTIVE) ERR-CAMPAIGN-ALREADY-ENDED)

    (map-set campaigns campaign-id (merge campaign { status: STATUS-CANCELLED }))
    (print {
      event: "campaign-cancelled",
      campaign-id: campaign-id,
      creator: tx-sender
    })
    (ok true)
  )
)

;; -----------------------------------------------
;; Read-Only Functions
;; -----------------------------------------------
(define-read-only (get-campaign (campaign-id uint))
  (map-get? campaigns campaign-id)
)

(define-read-only (get-contribution (campaign-id uint) (contributor principal))
  (default-to u0 (map-get? contributions { campaign-id: campaign-id, contributor: contributor }))
)

(define-read-only (get-contributor-at (campaign-id uint) (index uint))
  (map-get? campaign-contributors { campaign-id: campaign-id, index: index })
)

(define-read-only (get-backer-stats-info (backer principal))
  (default-to { campaigns-backed: u0, total-contributed: u0, total-refunded: u0 }
    (map-get? backer-stats backer))
)

(define-read-only (get-creator-stats-info (creator principal))
  (default-to { campaigns-created: u0, campaigns-funded: u0, total-raised: u0 }
    (map-get? creator-stats creator))
)

(define-read-only (get-total-campaigns)
  (var-get campaign-counter)
)

(define-read-only (get-funding-stats)
  {
    total-campaigns: (var-get campaign-counter),
    total-funded: (var-get total-campaigns-funded),
    total-raised: (var-get total-raised),
    total-refunds: (var-get total-refunds-issued)
  }
)

;; Clarity 4: to-ascii? for human-readable campaign info
(define-read-only (get-campaign-summary (campaign-id uint))
  (match (map-get? campaigns campaign-id)
    campaign (let (
      (raised-ascii (match (to-ascii? (get raised campaign)) ok-val ok-val err "0"))
      (goal-ascii (match (to-ascii? (get goal campaign)) ok-val ok-val err "0"))
      (backers-ascii (match (to-ascii? (get contributor-count campaign)) ok-val ok-val err "0"))
      (status-str (if (is-eq (get status campaign) STATUS-ACTIVE) "ACTIVE"
        (if (is-eq (get status campaign) STATUS-SUCCESSFUL) "SUCCESSFUL"
        (if (is-eq (get status campaign) STATUS-FAILED) "FAILED"
        "CANCELLED"))))
    )
      (ok {
        title: (get title campaign),
        category: (get category campaign),
        raised: raised-ascii,
        goal: goal-ascii,
        backers: backers-ascii,
        status: status-str,
        funds-withdrawn: (get funds-withdrawn campaign)
      })
    )
    ERR-CAMPAIGN-NOT-FOUND
  )
)

;; Initialize contract principal
