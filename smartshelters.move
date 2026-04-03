module smartshelters::smartshelters {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::dynamic_field;
    use world::assembly::Assembly;
    use world::access::OwnerCap;

    struct ShipSwapped has copy, drop { 
        player: address, 
        ship_id: address, 
        action: vector<u8> 
    };

    // Storage for ships per Shelter (using dynamic field on the Assembly)
    struct ShipStorage has store {
        ships: vector<address>,
    }

    // New function for official Shelters (Phase 1.5)
    public entry fun swap_ship_on_assembly(
        shelter: &mut Assembly,
        ship: address,
        is_deposit: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let key = b"smartshelters_storage";

        if (!dynamic_field::exists_(&shelter.id, key)) {
            dynamic_field::add(&mut shelter.id, key, ShipStorage {
                ships: vector::empty(),
            });
        };

        let storage = dynamic_field::borrow_mut<vector<u8>, ShipStorage>(&mut shelter.id, key);

        if (is_deposit) {
            vector::push_back(&mut storage.ships, ship);
        } else {
            let (found, idx) = vector::index_of(&storage.ships, &ship);
            if (found) {
                vector::remove(&mut storage.ships, idx);
            };
        };

        event::emit(ShipSwapped { 
            player: sender, 
            ship_id: ship, 
            action: if (is_deposit) { b"deposit" } else { b"withdraw" } 
        });
    }

    public fun view_ships(shelter: &Assembly): vector<address> {
        let key = b"smartshelters_storage";
        if (dynamic_field::exists_(&shelter.id, key)) {
            let storage = dynamic_field::borrow<vector<u8>, ShipStorage>(&shelter.id, key);
            storage.ships
        } else {
            vector::empty()
        }
    }

    // TODO: Add tribe + standings checks here in future phases
    public fun anchor_to_shelter(
        shelter: &mut Assembly,
        owner_cap: &OwnerCap<Assembly>,
        ctx: &mut TxContext
    ) {
        // Future: implement tribe/standing logic
    }
}
