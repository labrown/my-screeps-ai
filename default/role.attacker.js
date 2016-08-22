module.exports = {
    run: function (creep) {
        var group = Memory.groups[creep.memory.group],
            target = (group ? group.target : null) || creep.memory.target,
            closestTower,
            closestHostile,
            attackTarget;
        if (!target) {
            target = creep.memory.target = {
                room: "",
                x: 0,
                y: 0
            }
        }
        if (target.room) {
            closestTower = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType === STRUCTURE_TOWER;
                }
            });
            closestHostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            attackTarget = closestTower || closestHostile;
            if (attackTarget) {
                if (creep.attack(attackTarget) !== OK) {
                    creep.moveTo(attackTarget);
                }
            } else {
                creep.moveTo(new RoomPosition(target.x, target.y, target.room));
            }
        }
    }
}