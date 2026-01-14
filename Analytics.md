## Setup

The analytics system is configured with Mixpanel project token `07e09a223dcbe8fbe46d46a908f5b69e` and automatically tracks user interactions with the staking platform.

## Events Tracked

### Staking Events

- `new_stake_started` - When a user starts a new stake
- `new_stake_completed` - When a stake is successfully completed
- `new_stake_failed` - When a stake fails

### Stake and Delegate Events

- `new_stake_and_delegate_started` - When a user starts a new stake with delegation
- `new_stake_and_delegate_completed` - When a stake with delegation is successfully completed
- `new_stake_and_delegate_failed` - When a stake with delegation fails

### Delegation Events

- `delegation_started` - When a user starts delegating an NFT
- `delegation_completed` - When delegation is successfully completed
- `delegation_failed` - When delegation fails
- `stop_delegation_started` - When a user starts stopping delegation
- `stop_delegation_completed` - When stopping delegation is successfully completed
- `stop_delegation_failed` - When stopping delegation fails

### Boost Events

- `boost_started` - When a user starts boosting an NFT (skipping maturity period)
- `boost_completed` - When boost is successfully completed
- `boost_failed` - When boost fails

### Claiming Events

- `claim_delegate_rewards_started` - When a user starts claiming delegate rewards
- `claim_delegate_rewards_completed` - When delegate rewards are successfully claimed
- `claim_delegate_rewards_failed` - When claiming delegate rewards fails

### Unstaking Events

- `unstake_started` - When a user starts unstaking
- `unstake_completed` - When unstaking is successfully completed
- `unstake_failed` - When unstaking fails

### Node Management Events

- `add_manager_started` - When a user starts adding a manager
- `add_manager_completed` - When adding a manager is successfully completed
- `add_manager_failed` - When adding a manager fails
- `remove_manager_started` - When a user starts removing a manager
- `remove_manager_completed` - When removing a manager is successfully completed
- `remove_manager_failed` - When removing a manager fails

### Migration Events

- `nft_migration_started` - When a user starts migrating an NFT
- `nft_migration_completed` - When NFT migration is successfully completed
- `nft_migration_failed` - When NFT migration fails

### Validator Events

- `new_validator_started` - When a user starts creating a new validator
- `new_validator_completed` - When validator creation is successfully completed
- `new_validator_failed` - When validator creation fails
- `exit_validator_started` - When a user starts exiting a validator
- `exit_validator_completed` - When exiting a validator is successfully completed
- `exit_validator_failed` - When exiting a validator fails
- `unstake_validator_started` - When a user starts unstaking from a validator
- `unstake_validator_completed` - When unstaking from a validator is successfully completed
- `unstake_validator_failed` - When unstaking from a validator fails
- `increase_stake_started` - When a user starts increasing validator stake
- `increase_stake_completed` - When increasing validator stake is successfully completed
- `increase_stake_failed` - When increasing validator stake fails
- `decrease_stake_started` - When a user starts decreasing validator stake
- `decrease_stake_completed` - When decreasing validator stake is successfully completed
- `decrease_stake_failed` - When decreasing validator stake fails

### Beneficiary Events

- `set_beneficiary_started` - When a user starts setting a beneficiary for a validator
- `set_beneficiary_completed` - When setting a beneficiary is successfully completed
- `set_beneficiary_failed` - When setting a beneficiary fails

### General Events

- `wallet_connected` - When a wallet is connected
- `wallet_disconnected` - When a wallet is disconnected

### Flow Events

- `delegate_flow_started` - When the DelegateView component is opened (user enters the delegation flow)
- `delegate_confirm_modal_opened` - When the DelegateModal confirmation modal is opened (user clicks "Continue" to confirm delegation)

## Event Properties

Each event includes the following base properties:

- `timestamp` - Unix timestamp of the event
- `user_address` - User's wallet address (when connected)
- `network` - Current network (testnet/mainnet)
- `environment` - Environment (development/production)

### Error Properties

All failed events include:

- `error_type` - Type of error that occurred
- `error_reason` - Optional detailed reason for the error

### Specific Event Properties

#### Staking Events

- `level_id` - NFT level ID
- `level_name` - NFT level name
- `vet_amount` - Amount of VET staked
- `token_id` - Generated token ID (on completion)
- `transaction_hash` - Transaction hash (on completion)

#### Stake and Delegate Events

- `level_id` - NFT level ID
- `level_name` - NFT level name
- `vet_amount` - Amount of VET staked
- `token_id` - Generated token ID (on completion)
- `transaction_hash` - Transaction hash (on completion)
- `is_recommended_validator` - Whether the recommended validator was selected
- `validator_address` - Address of the selected validator

#### Delegation Events

- `token_id` - NFT token ID
- `transaction_hash` - Transaction hash (on completion)
- `mode` - Delegation mode: `"delegate"`, `"change_validator"`, or `"boost_and_delegate"`
- `validator_address` - Address of the selected validator
- `is_recommended_validator` - Whether the recommended validator was selected

#### Boost Events

- `token_id` - NFT token ID
- `boost_amount` - Amount of VTHO used for boosting
- `transaction_hash` - Transaction hash (on completion)
- `is_recommended_validator` - Whether the recommended validator was selected
- `validator_address` - Address of the selected validator

#### Claiming Events

- `token_ids` - Array of token IDs being claimed
- `total_rewards` - Total rewards being claimed
- `delegation_rewards` - Delegation rewards amount (optional)
- `transaction_hash` - Transaction hash (on completion)

#### Unstaking Events

- `token_id` - NFT token ID
- `vet_amount` - Amount of VET being unstaked
- `transaction_hash` - Transaction hash (on completion)

#### Manager Events

- `token_id` - NFT token ID
- `manager_address` - Manager's wallet address
- `transaction_hash` - Transaction hash (on completion)

#### Migration Events

- `legacy_token_id` - Legacy token ID being migrated
- `transaction_hash` - Transaction hash (on completion)

#### Validator Events

- `validator_address` - Validator's wallet address
- `beneficiary_address` - Beneficiary address (optional, for new validator)
- `stake_amount` - Amount of VET staked (optional)
- `cycle_period` - Cycle period in blocks (optional)
- `transaction_hash` - Transaction hash (on completion)

#### Beneficiary Events

- `validator_address` - Validator's wallet address
- `beneficiary_address` - Beneficiary address being set
- `transaction_hash` - Transaction hash (on completion)

#### Flow Events

- `token_id` - NFT token ID (required)
- `mode` - Flow mode: `"delegate"`, `"change_validator"`, or `"boost_and_delegate"` (optional)
- `validator_address` - Address of the selected validator (optional, for `delegate_confirm_modal_opened` only)
- `is_recommended_validator` - Whether the recommended validator was selected (optional, for `delegate_confirm_modal_opened` only)
