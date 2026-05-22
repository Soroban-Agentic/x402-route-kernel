#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SpendingLimit {
    pub token: Address,
    pub max_amount: i128,
    pub period_seconds: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Allowance {
    pub spent: i128,
    pub reset_at: u64,
}

#[contracttype]
pub enum DataKey {
    Owner,
    Guardian,
    Limit(Address),
    Allowance(Address),
}

#[contract]
pub struct AgentGuardWallet;

#[contractimpl]
impl AgentGuardWallet {
    pub fn initialize(env: Env, owner: Address, guardian: Address) {
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Guardian, &guardian);
    }

    pub fn set_spending_limit(env: Env, caller: Address, token: Address, max_amount: i128, period_seconds: u64) {
        caller.require_auth();
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        if caller != owner {
            panic!("only owner can set limits");
        }
        let limit = SpendingLimit { token: token.clone(), max_amount, period_seconds };
        env.storage().instance().set(&DataKey::Limit(token.clone()), &limit);
        env.storage().instance().set(&DataKey::Allowance(token), &Allowance { spent: 0, reset_at: env.ledger().timestamp() + period_seconds });
    }

    pub fn check_allowance(env: Env, token: Address, amount: i128) -> bool {
        let limit: SpendingLimit = env.storage().instance().get(&DataKey::Limit(token.clone())).unwrap();
        let mut allowance: Allowance = env.storage().instance().get(&DataKey::Allowance(token.clone())).unwrap();

        let now = env.ledger().timestamp();
        if now >= allowance.reset_at {
            allowance.spent = 0;
            allowance.reset_at = now + limit.period_seconds;
        }

        (allowance.spent + amount) <= limit.max_amount
    }

    pub fn spend(env: Env, caller: Address, token: Address, amount: i128) {
        caller.require_auth();
        if !Self::check_allowance(env.clone(), token.clone(), amount) {
            panic!("spending limit exceeded");
        }
        let mut allowance: Allowance = env.storage().instance().get(&DataKey::Allowance(token.clone())).unwrap();
        allowance.spent += amount;
        env.storage().instance().set(&DataKey::Allowance(token), &allowance);
    }

    pub fn guardian_override(env: Env, guardian: Address) {
        guardian.require_auth();
        let stored: Address = env.storage().instance().get(&DataKey::Guardian).unwrap();
        if guardian != stored {
            panic!("unauthorized guardian");
        }
    }
}

mod test;
