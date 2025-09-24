# StemPay Lottery Manager - Contract Rules and Verification Points

## Access Control Rules

### ✅ 1. Admin Initialization
- **Rule**: Only admin can initialize the contract
- **Implementation**: Uses OpenZeppelin's `initializer` modifier which can only be called once during deployment
- **Verification**: The `initialize` function sets `msg.sender` as the owner through `__Ownable_init(msg.sender)`

### ✅ 2. Admin Operations
- **Rule**: Only the admin can cancel and draw the lottery
- **Implementation**: Both `cancelLottery` and `drawWinner` functions use `onlyOwner` modifier
- **Verification**: Admin cannot clear lottery data - this functionality has been completely removed

## Lottery Lifecycle Rules

### ✅ 3. Cancellation Before Time
- **Rule**: Lottery can be cancelled before time
- **Implementation**: Admin can call `cancelLottery` before draw time
- **Status Display**: Cancelled lotteries show `isCancelled: true` status
- **Refunds**: Participants can withdraw full participation fee via `withdrawFunds`

### ✅ 4. Participant Vote Cancellation
- **Rule**: Participants can vote to cancel with 2/3 majority
- **Implementation**: `voteCancel` function checks if `voteCount * 3 >= participants.length * 2`
- **Auto-Cancellation**: Lottery automatically cancels when 2/3 threshold is reached
- **Refunds**: Full participation fee refundable via `withdrawFunds`

## Draw Requirements Rules

### ✅ 5. Admin-Only Draw Before Time
- **Rule**: Before draw time, only admin can draw the lottery if required participants are reached
- **Implementation**: `drawWinner` requires `l.participants.length >= l.maxParticipants` and `onlyOwner` modifier
- **No Auto-Draw**: No automatic drawing before draw time - admin must manually call `drawWinner`

### ✅ 6. No Upper Limit Before Draw Time
- **Rule**: No upper limit on participants before draw time is reached
- **Implementation**: Participants can join indefinitely before `drawTime` with no maximum restriction
- **Manual Draw**: Admin can manually draw once minimum participants are reached, regardless of how many joined

### ✅ 7. Automatic Draw After Time
- **Rule**: After draw time, lottery auto-draws when required participant count is reached
- **Implementation**: `enterLottery` calls `_autoDrawLottery` after adding participant if count reached
- **Trigger Conditions**: 
  - Draw time has passed
  - Participant joins and brings total to exactly required count
  - Auto-draw happens immediately after participant is added

### ✅ 8. No Draw Without Required Participants
- **Rule**: Admin cannot draw if insufficient participants after draw time
- **Implementation**: `drawWinner` always requires `maxParticipants` minimum
- **Auto-Draw**: Will auto-draw when requirement is finally met by participant joining

## Withdrawal Rules

### ✅ 9. Unified Withdrawal Method
- **Rule**: Single method for both refunds and prize withdrawal
- **Implementation**: `withdrawFunds` handles all withdrawal scenarios
- **Logic**: 
  - Cancelled lottery: Full participation fee
  - Drawn lottery (winner): Refundable amount + winning amount based on prize percentage
  - Drawn lottery (non-winner): Only refundable amount (not full participation fee)

### ✅ 10. Participation Fee Structure
- **Rule**: Participation fee consists of refundable and non-refundable portions
- **Implementation**: `createLottery` takes both `participationFee` and `refundableAmount`
- **Validation**: `refundableAmount` must be greater than 0 and cannot exceed `participationFee`
- **Refund Logic**: 
  - Cancelled lottery: Full participation fee returned
  - Drawn lottery (winner): Refundable amount + prize
  - Drawn lottery (loser): Only refundable amount

### ✅ 11. Percentage-Based Fees
- **Rule**: Admin passes percentages instead of fixed amounts
- **Implementation**: `createLottery` takes `prizePercentage`, `investmentPercentage`, `profitPercentage`
- **Validation**: All three percentages must sum to exactly 100
- **Calculation**: Amounts calculated dynamically based on total collected fees

## Lottery Management Rules

### ✅ 12. Separate Drawn Lottery List
- **Rule**: Drawn lotteries maintained in separate public list
- **Implementation**: `drawnLotteryIds` array tracks all drawn lotteries
- **Public Access**: `getDrawnLotteries()` function provides public access
- **Auto-Management**: Lotteries moved from active to drawn list automatically

### ✅ 13. Auto-Deletion After Last Withdrawal
- **Rule**: Drawn lottery auto-deletes when last participant withdraws
- **Implementation**: `_checkAndDeleteLottery` called after each withdrawal
- **Cleanup**: Removes lottery from `drawnLotteryIds` and deletes from storage
- **Event**: Emits `LotteryAutoDeleted` event for transparency

### ✅ 14. 60-Day Refund Period
- **Rule**: Participants have 60 days to withdraw refunds
- **Implementation**: `REFUND_PERIOD = 60 days` constant
- **Enforcement**: Non-winners cannot withdraw after `drawTimestamp + REFUND_PERIOD`
- **Admin Recovery**: `withdrawExpiredRefunds` allows admin to recover unclaimed refundable amounts

### ✅ 15. No Migration Functionality
- **Rule**: Migration to next lottery is not supported
- **Implementation**: All migration-related code completely removed
- **Cleanup**: `migrateToLottery` function and related logic eliminated

## Code Quality Rules

### ✅ 16. No Unused Code
- **Rule**: Remove all unnecessary, unrelated, or unused code
- **Implementation**: 
  - Removed `clearLotteryData` function
  - Removed `migrateToLottery` function
  - Removed `claimRefund` and `claimPrize` (replaced with unified `withdrawFunds`)
  - Removed unused helper functions
  - Added `refundableAmount` field for proper refund handling
  - Removed `allLotteryIds` (replaced with `activeLotteryIds` and `drawnLotteryIds`)

## Event Tracking

### ✅ 17. Comprehensive Event System
- **Events Implemented**:
  - `LotteryCreated`: When lottery is created
  - `EnteredLottery`: When participant joins
  - `LotteryDrawRequested`: When draw is initiated
  - `WinnerSelected`: When winner is determined
  - `LotteryCancelled`: When lottery is cancelled
  - `FundsWithdrawn`: When participant withdraws funds
  - `LotteryAutoDeleted`: When lottery is auto-deleted

## Data Structures

### ✅ 18. Optimized Storage
- **Active Lotteries**: `activeLotteryIds[]` for ongoing lotteries
- **Drawn Lotteries**: `drawnLotteryIds[]` for completed lotteries
- **Unified Tracking**: `hasWithdrawn` replaces separate `hasClaimed` and `hasRefunded`
- **Timestamp Tracking**: `drawTimestamp` for refund period calculation
- **Refund Structure**: `refundableAmount` field separate from total `participationFee`

## Security Features

### ✅ 19. Access Control
- **OpenZeppelin Integration**: Uses battle-tested `OwnableUpgradeable`
- **Reentrancy Protection**: `nonReentrant` modifier on critical functions
- **Input Validation**: Comprehensive require statements throughout

### ✅ 20. Upgradeability
- **UUPS Pattern**: Secure upgrade mechanism with `onlyOwner` authorization
- **State Preservation**: Upgrade-safe storage layout

## Testing Checklist

To verify these rules in the future, test the following scenarios:

1. **Initialization**: Only deployer can initialize, cannot be called twice
2. **Admin Operations**: Only owner can create, cancel, and draw lotteries
3. **Participation**: Users can join before time, auto-draw triggers correctly
4. **Voting**: 2/3 majority cancellation works correctly
5. **Refund Structure**: Refundable amount validation and proper handling
6. **Withdrawals**: Unified withdrawal works for all scenarios
   - Cancelled: Full participation fee returned
   - Winner: Refundable amount + prize
   - Loser: Only refundable amount
7. **Percentages**: Prize/investment/profit calculations are accurate
8. **Time Limits**: 60-day refund period enforced correctly
9. **Auto-Deletion**: Lotteries auto-delete after all withdrawals
10. **Lists**: Active and drawn lottery lists update correctly
11. **Security**: Access controls prevent unauthorized operations
