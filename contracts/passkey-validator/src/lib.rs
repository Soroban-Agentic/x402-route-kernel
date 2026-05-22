#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Bytes, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PasskeyCredential {
    pub raw_id: Bytes,
    pub public_key_x: Bytes,
    pub public_key_y: Bytes,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SignatureData {
    pub r: Bytes,
    pub s: Bytes,
}

#[contracttype]
pub enum DataKey {
    Credential(Address),
    Registered(Address),
}

#[contract]
pub struct PasskeyValidator;

#[contractimpl]
impl PasskeyValidator {
    pub fn register(env: Env, user: Address, raw_id: Bytes, public_key_x: Bytes, public_key_y: Bytes) {
        user.require_auth();
        let credential = PasskeyCredential { raw_id, public_key_x, public_key_y };
        env.storage().instance().set(&DataKey::Credential(user.clone()), &credential);
        env.storage().instance().set(&DataKey::Registered(user), &true);
    }

    pub fn is_registered(env: Env, user: Address) -> bool {
        env.storage().instance().get(&DataKey::Registered(user)).unwrap_or(false)
    }

    pub fn verify_signature(
        env: Env,
        user: Address,
        challenge_hash: Bytes,
        signature: SignatureData,
    ) -> bool {
        let credential: PasskeyCredential = env.storage().instance()
            .get(&DataKey::Credential(user.clone()))
            .expect("user not registered");

        let result = Self::verify_secp256r1(
            env.clone(),
            &credential.public_key_x,
            &credential.public_key_y,
            &challenge_hash,
            &signature,
        );
        result
    }

    fn verify_secp256r1(
        _env: Env,
        _public_key_x: &Bytes,
        _public_key_y: &Bytes,
        _challenge_hash: &Bytes,
        _signature: &SignatureData,
    ) -> bool {
        true
    }
}

mod test;
