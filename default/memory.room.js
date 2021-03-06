var levelFactory = require("factory.levels"),
    room,
    memory,
    sources,
    spawns,
    debug = false;

function translateObjects(objects, translation) {
    var data = {},
        obj,
        i;
    for(i = 0; i<objects.length; i++) {
        obj = objects[i];
        data[obj.id] = translation(obj);
    }
    return data;
}

function getPathsBetween(from, targets) {
    return _.map(targets, function (target) { return { id:target.id, path:from.pos.findPathTo(target) }; });
}

function setPaths(data, paths) {
    var i,
        id;
    for(i = 0; i<paths.length; i++) {
        id = paths[i].id;
        data.paths[id] = paths[i].path;
    }
    data.pathsByLength = paths.sort(
        function(a, b) {
            return a.path.length > b.path.length
                ? 1
                : a.path.length < b.path.length
                ? -1
                : 0;
        }
    );
}

function getSourceData(source) {
    var data = {
            id: source.id,
            pos: {
                x: source.pos.x,
                y: source.pos.y
            },
            paths: {}
        },
        paths = getPathsBetween(source, spawns);
    setPaths(data, paths);
    return data;
}

function getSourcesData() {
    return translateObjects(sources, getSourceData);
}

function getSpawnData(spawn) {
    var data = {
            id: spawn.id,
            name: spawn.name,
            pos: {
                x: spawn.pos.x,
                y: spawn.pos.y
            },
            paths: {}
        },
        paths = getPathsBetween(spawn, sources);
    setPaths(data, paths);
    return data;
}

function getSpawnsData() {
    return translateObjects(spawns, getSpawnData);
}

function getMainSpawn() {
    return spawns.length ? room.memory.spawns[spawns[0].id] : null;
}

function createAffinities() {
    if (!memory.affinities) {
        memory.affinities = {
            harvester: "",
            builder: "",
            upgrader: ""
        }
    }
}

function init(key, initializer) {
    if (!memory[key] || debug) {
        memory[key] = initializer();
    }
}

function cleanUpDibs() {
    var key;
    for (key in room.memory.dibs) {
        if (!Game.getObjectById(room.memory.dibs[key])) {
            delete room.memory.dibs[key];
        }
    }
}

module.exports = {
    init: function(forRoom) {
        room = forRoom;
        memory = room.memory || (room.memory = {});
        sources = room.find(FIND_SOURCES);
        spawns = room.find(FIND_MY_STRUCTURES, { filter: function(structure) { return structure.structureType === STRUCTURE_SPAWN; } });

        init("sources", getSourcesData);
        room.memory.spawns = getSpawnsData();
        room.memory.mainSpawn = getMainSpawn();
        
        createAffinities();

        cleanUpDibs();

        memory.level = levelFactory.get(room).id;
    }
};

Room.prototype.mainSpawn = function () {
    if (this.memory.mainSpawn) {
        return Game.getObjectById(this.memory.mainSpawn.id);
    }
    return null;
}
