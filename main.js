var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadMaint = require('role.roadmaint');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var roadmaintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadmaint');
    //console.log('Harvesters: ' + harvesters.length);
    //console.log('Builders: ' + builders.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    } 
	else {
		if(upgrader.length < 2) {
			var newName = 'Upgrader' + Game.time;
			console.log('Spawning new upgrader: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
				{memory: {role: 'upgrader'}});
		}
		else {
			if(builders.length < 3) {
				var newName = 'Builder' + Game.time;
				console.log('Spawning new builder: ' + newName);
				Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'builder'}});
			
			}
			else {
				if(roadmaintainers.length < 2) {
					var newName = 'RoadMaint' + Game.time;
					console.log('Spawning new road maintainer: ' + newName);
					Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
						{memory: {role: 'roadmaint'}});
				}
			}
		}
	}
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
		if(creep.memory.role == 'roadmaint') {
            roleRoadMaint.run(creep);
        }
    }
}