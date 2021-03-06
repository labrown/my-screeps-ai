/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.dropper');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        var result,
            affinity = creep.affinity(),
            loadOff = creep.affinity("loadOff");
        if (!affinity) {
            creep.say("Where?");
            return;
        }
        var resource = affinity;
        if (creep.isFull()) {
            if (loadOff) {
                result = creep.transfer(loadOff, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(loadOff);
                }
            } else {
                creep.drop(RESOURCE_ENERGY, creep.carryCapacity);
            }
        } else {
            if (creep.harvest(resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(resource);
            }
        }
    }
};