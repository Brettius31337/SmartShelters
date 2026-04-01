module smartshelters::smartshelters {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use world::assembly::{Self, Assembly};
    use world::access::OwnerCap;

    struct SmartShelter has key {
        id: UID,
        owner: address,
        ships: vector<address>,
    }

    struct ShipSwapped has copy, drop { 
        player: address, 
        ship_id: address, 
        action: vector<u8> 
    };

    public entry fun create_shelter(ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let shelter = SmartShelter {
            id: object::new(ctx),
            owner,
            ships: vector::empty(),
        };
        transfer::public_share_object(shelter);
    }

    public entry fun swap_ship(
        shelter: &mut SmartShelter,
        ship: address,
        is_deposit: bool,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        if (is_deposit) {
            vector::push_back(&mut shelter.ships, ship);
        };

        event::emit(ShipSwapped { 
            player: sender, 
            ship_id: ship, 
            action: if (is_deposit) { b"deposit" } else { b"withdraw" } 
        });
    }

    public fun view_ships(shelter: &SmartShelter): vector<address> {
        shelter.ships
    }

    // Compatible with official anchor system
    public fun anchor_to_shelter(
        shelter: &mut SmartShelter,
        assembly: Assembly,
        owner_cap: &OwnerCap<Assembly>,
        ctx: &mut TxContext
    ) {
        // Official anchor logic would go here
        // This is a stub for compatibility
    }
}
