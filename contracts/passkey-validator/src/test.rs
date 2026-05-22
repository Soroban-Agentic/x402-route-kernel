#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Bytes, Env};

#[test]
fn test_register_and_verify() {
    let env = Env::default();
    env.mock_all_auths();

    let user = Address::generate(&env);
    let raw_id = Bytes::from_slice(&env, &[0u8; 32]);
    let pub_x = Bytes::from_slice(&env, &[1u8; 32]);
    let pub_y = Bytes::from_slice(&env, &[2u8; 32]);

    let contract_id = env.register(PasskeyValidator, (&));
    let client = PasskeyValidatorClient::new(&env, &contract_id);

    client.register(&user, &raw_id, &pub_x, &pub_y);
    assert!(client.is_registered(&user));

    let challenge = Bytes::from_slice(&env, &[3u8; 32]);
    let sig = SignatureData {
        r: Bytes::from_slice(&env, &[4u8; 32]),
        s: Bytes::from_slice(&env, &[5u8; 32]),
    };

    let valid = client.verify_signature(&user, &challenge, &sig);
    assert!(valid);
}
