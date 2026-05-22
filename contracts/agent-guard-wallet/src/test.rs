#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, vec, Env, IntoVal, Symbol};

#[test]
fn test_set_and_check_limit() {
    let env = Env::default();
    env.mock_all_auths();

    let owner = Address::generate(&env);
    let guardian = Address::generate(&env);
    let token = Address::generate(&env);

    let contract_id = env.register(AgentGuardWallet, (&owner, &guardian));
    let client = AgentGuardWalletClient::new(&env, &contract_id);

    client.set_spending_limit(&owner, &token, &1000i128, &86400u64);
    assert!(client.check_allowance(&token, &500i128));
    client.spend(&owner, &token, &500i128);
    assert!(client.check_allowance(&token, &500i128));
    assert!(!client.check_allowance(&token, &501i128));
}

#[test]
fn test_guardian_override() {
    let env = Env::default();
    env.mock_all_auths();

    let owner = Address::generate(&env);
    let guardian = Address::generate(&env);

    let contract_id = env.register(AgentGuardWallet, (&owner, &guardian));
    let client = AgentGuardWalletClient::new(&env, &contract_id);

    client.guardian_override(&guardian);
}
