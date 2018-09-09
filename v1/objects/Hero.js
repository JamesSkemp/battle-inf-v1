var baseHero = function() {
    // REMOVED

    this.calculateStats = function() {
        for (var i in this.baseStats)
            this.stats[i] = this.baseStats[i];
        
        for (var e in this.equipment)
        {
            var slot = this.equipment[e];
            if (isArray(slot))
            {
                for (var j in slot)
                {
                    var item = slot[j];
                    if (item !== null)
                        for (var i in item.stats)
                            this.stats[i] += item.stats[i];
                }
            }
            else if (slot !== null)
            {
                item = slot;
                for (var i in item.stats)
                    this.stats[i] += item.stats[i];
            }
        }
    };
    
    // keepInventory, should the item be added or removed from the inventory?
    this.unequip = function(unequipItem, keepInventory) {
        if (!keepInventory)
            player.addItem(unequipItem);
        
        for (var e in this.equipment)
        {
            var slot = this.equipment[e];
            if (isArray(slot))
            {
                for (var j in slot)
                    if (slot[j] === unequipItem)
                        this.equipment[e][j] = null;
            }
            else if (slot !== null)
            {
                if (slot === unequipItem)
                    this.equipment[e] = null;
            }
        }
        
        this.calculateStats();
        this.buildEquipmentList();
    };
    
    this.equip = function(item, keepInInventory) {
        if (item.level > this.level)
        {
            globalMessageService.appendMessage('The item is too high of a level.');
            return;
        }
        
        if (isArray(this.equipment[item.type]))
        {
            var slots = this.equipment[item.type];
            var requiredSlots = itemTypes[item.type][item.subType].slots;
            var spaceFound = false;
            var firstEmptySlot = -1;
            var sequentialSlots = 0;
            
            // Look for enough sequential slots
            // i is incremented in the body
            for (var i = 0; i < slots.length;)
            {
                var slotItem = this.equipment[item.type][i];
                
                if (slotItem === null)
                {
                    if (firstEmptySlot === -1)
                        firstEmptySlot = i;
                    
                    sequentialSlots++;
                    i++;
                }
                else
                {
                    firstEmptySlot = -1;
                    sequentialSlots = 0;
                    i += itemTypes[slotItem.type][slotItem.subType].slots;
                }
                
                if (sequentialSlots === requiredSlots)
                {
                    
                    this.equipment[item.type][firstEmptySlot] = item;
                    spaceFound = true;
                    break;
                }
            }
            
            // No space was found
            if (!spaceFound)
            {
                for (var i = 0; i < requiredSlots; i++)
                    if (this.equipment[item.type][i] !== null)
                        this.unequip(this.equipment[item.type][i], keepInInventory);
                this.equipment[item.type][0] = item;
            }
        }
        else
        {
            // Unequip the original item
            if (this.equipment[item.type] !== null)
                this.unequip(this.equipment[item.type], keepInInventory);

            this.equipment[item.type] = item;
        }
        
        if (!keepInInventory)
            player.removeItem(item);
        
        this.calculateStats();
        this.buildEquipmentList();
    };
    
    this.buildEquipmentList = function() {
        this.equipmentList = [
            {
                displayName: 'L-HAND'
                ,item: this.equipment.hand[0]
            }
            ,{
                displayName: 'R-HAND'
                ,item: this.equipment.hand[1]
            }
            ,{
                displayName: 'HEAD'
                ,item: this.equipment.head
            }
            ,{
                displayName: 'BODY'
                ,item: this.equipment.body
            }
            ,{
                displayName: 'HANDS'
                ,item: this.equipment.hands
            }
            ,{
                displayName: 'LEGS'
                ,item: this.equipment.legs
            }
            ,{
                displayName: 'FEET'
                ,item: this.equipment.feet
            }
        ];
    };
    
    this.buildEquipmentList();
};
baseHero.prototype = new BattleUnit();