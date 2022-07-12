var roleGlobal = require('role.global');
var loopCore =
{
  creepManagement: function(roomName)
	{
		function genNewName (roleName)
		{
			var units = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);
			var prefix = ''
			var limit = 0
			var newNumber = 1
			switch(roleName)
			{
				case 'harvester':
				{
					prefix = 'hvst'
					limit = harvesterCount
					break;
				}
				case 'upgrader':
				{
					prefix = 'upgrd'
					limit = upgraderCount
					break;
				}
				case 'builder':
				{
					prefix = 'bldr'
					limit = builderCount
					break;
				}
				case 'roadmaint':
				{
					prefix = 'rdMnt'
					limit = roadMaintCount
					break;
				}
				case 'truck':
				{
					prefix = 'trk'
					limit = truckCount
					break;
				}
				case 'spawnNanny':
				{
					prefix = 'spnNny'
					limit = spawnNannyCount
					break;
				}
				case 'harvestNanny':
				{
					prefix = 'hvtNny'
					limit = harvestNannyCount
					break;
				}
			}
			
			var numbers = units.map(function(a) { var test = a.name; return test.replace(prefix,'');})
			for(let intCount = 1; intCount <= limit; intCount++)
			{
				var test = numbers.find(element => element == intCount)
				if(test == null)
				{
					newNumber = intCount
				}
			}
			return prefix.concat(newNumber)
		}
		
		{//Core Variables for Creep Configuration
			var myRoom = Memory.rooms.find(element => element.name == roomName);
			var harvesterCount = 0;
			var harvesterBuild = [WORK,CARRY,MOVE,MOVE]
			var upgraderCount = 0;
			var upgraderBuild = [WORK,CARRY,MOVE,MOVE]
			var builderCount = 0;
			var builderBuild = [WORK,CARRY,MOVE,MOVE]
			var roadMaintCount = 0;
			var roadMaintBuild = [WORK,CARRY,MOVE,MOVE]
			var truckCount = 0;
			var truckBuild = [CARRY,CARRY,MOVE,MOVE]
			var spawnNannyCount = 0;
			var spawnNannyBuild = [CARRY,CARRY,CARRY,MOVE]
		}
		
		{//Phase Based Creep Configuration
			switch(myRoom.phase)
			{
				case 0:
				{
					harvesterCount = 4;
					upgraderCount = 3;
					builderCount = 4;
					roadMaintCount = 0;
					truckCount = 0;
					spawnNannyCount = 0;
					break;
				}
				case 1:
				case 2:
				{
					harvesterCount = 4;
					upgraderCount = 3;
					builderCount = 4;
					roadMaintCount = 1;
					truckCount = 0;
					spawnNannyCount = 0;
					break;
				}
				case 3:
				case 4:
				{
					harvesterCount = 4;
					harvesterBuild = [WORK,WORK,CARRY,MOVE]
					upgraderCount = 3;
					builderCount = 4;
					roadMaintCount = 2;
					truckCount = 1;
					spawnNannyCount = 1;
					break;
				}
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				{					
					harvesterCount = 2;
					harvesterBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					upgraderCount = 3;
					upgraderBuild = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
					builderCount = 2;
					roadMaintCount = 3;
					truckCount = 4;
					truckBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					spawnNannyCount = 1;
					spawnNannyBuild = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
					break;
				}
			}
		}
		
		{//Clean Up Missing Creeps
			for(var name in Memory.creeps)
			{
			  if(!Game.creeps[name])
			  {
				delete Memory.creeps[name];
			  }
			}
		}
		
		{//Get Creep Counts
			var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.room == roomName);
			var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.room == roomName);
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.room == roomName);
			var roadMaintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadmaint' && creep.memory.room == roomName);
			var trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck' && creep.memory.room == roomName);
			var spawnNannys = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawnNanny' && creep.memory.room == roomName);
		}
		
		{//Handle Spawning Creeps
			if(harvesters.length < harvesterCount)
			{
				var newName = genNewName('harvester');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(harvesterBuild, newName,{memory: {role: 'harvester', weight: weight, worker: true, room: roomName}});
			}
			else if(upgrader.length < upgraderCount)
			{
				var newName = genNewName('upgrader');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(upgraderBuild, newName, {memory: {role: 'upgrader',weight:weight,worker:true, room: roomName}});
			}
			else if(builders.length < builderCount)
			{
				var newName = genNewName('builder');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(builderBuild, newName,{memory: {role: 'builder',weight:weight,worker:true, room: roomName}});
			}
			else if(roadMaintainers.length < roadMaintCount)
			{
				var newName = genNewName('roadmaint');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(roadMaintBuild, newName, {memory: {role: 'roadmaint',weight:weight,worker:true, room: roomName}});
			}
			else if(trucks.length < truckCount)
			{
				var newName = genNewName('truck');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(truckBuild, newName, {memory: {role: 'truck',weight:weight,worker:true, room: roomName}});
			}
			else if(spawnNannys.length < spawnNannyCount)
			{
				
				var newName = genNewName('spawnNanny');
				var weight = 1
				if(newName.charAt(newName.length - 1) % 2 == 0)
				{
					weight = 0
				}
				Game.spawns[roomName].spawnCreep(spawnNannyBuild, newName, {memory: {role: 'spawnNanny',weight:weight,worker:true, room: roomName}});
			}
		}
		
		{//Handle DeSpawning Creeps
			if(harvesters.length > harvesterCount)
			{

			}
			else if(upgrader.length > upgraderCount)
			{
				
			}
			else if(builders.length > builderCount)
			{
				
			}
			else if(roadMaintainers.length > roadMaintCount)
			{
				
			}
			else if(trucks.length > truckCount)
			{

			}
			else if(spawnNannys.length > spawnNannyCount)
			{

			}
		}
			
		{//Report Spawn Activity
			if(Game.spawns[roomName].spawning)
			{
			  var spawningCreep = Game.creeps[Game.spawns[roomName].spawning.name];
			  Game.spawns[roomName].room.visual.text('🛠️' + spawningCreep.memory.role,Game.spawns[roomName].pos.x + 1,Game.spawns[roomName].pos.y,{align: 'left', opacity: 0.8});
			}
		}
		
		{//Give Creeps Their Roles
			for(var name in Game.creeps)
			{
				var creep = Game.creeps[name];
				switch(creep.memory.role)
				{
					case 'harvester':
					roleGlobal.run(creep);
					break;
					case 'upgrader':
					roleGlobal.run(creep);
					break;
					case 'builder':
					roleGlobal.run(creep);
					break;
					case 'roadmaint':
					roleGlobal.run(creep);
					break;
					case 'truck':
					roleGlobal.run(creep);
					break;
					case 'spawnNanny':
					roleGlobal.run(creep);
					break;
					case 'harvestNanny':
					roleGlobal.run(creep);
					break;
				}
			}
		}
	},
	
	jobManagement: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var roomJobs = myRoom.jobs
		let thisRoom = Game.rooms[roomName];
		
		let repairTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => (structure.hits < structure.hitsMax)});
		//get current repair work from memory
		//get structures needing repair from room
		//compare and prioritze
		
		let constructionTargets = thisRoom.find(FIND_MY_CONSTRUCTION_SITES);
		//get current build work from memory
		//get build jkbs for consteuction
		//compare and prioritize
		
		let deliveryTargets = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)});
		//get truck related work from memory
		//get new rruck work from room
		//compare and prioritize
		//console.log(JSON.stringify(repairTargets))
		for(repairTarget in repairTargets)
		{
			console.log(JSON.stringify(repairTarget))
			var applicableJobs = _.filter(roomJobs, (job) => job.id == repairTargets[repairTarget].id && job.action == 'repair');
			if(applicableJobs.length >= 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = repairTargets[repairTarget].id
				newJob.action = 'repair'
				newJob.amount = repairTargets[repairTarget].hitsMax - repairTargets[repairTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
		for(deliveryTarget in deliveryTargets)
		{
			console.log(JSON.stringify(deliveryTarget))
			var applicableJobs = _.filter(roomJobs, (job) => job.id == deliveryTargets[deliveryTarget].id && job.action == 'repair');
			if(applicableJobs.length >= 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = deliveryTargets[deliveryTarget].id
				newJob.action = 'delivery'
				newJob.amount = deliveryTargets[deliveryTarget].hitsMax - deliveryTargets[deliveryTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
		for(constructionTarget in constructionTargets)
		{
			console.log(JSON.stringify(constructionTarget))
			var applicableJobs = _.filter(roomJobs, (job) => job.id == constructionTargets[constructionTarget].id && job.action == 'repair');
			if(applicableJobs.length >= 1)
			{//Make sure we have enough engaged
			}
			else
			{//create the job
				var newJob = {}
				newJob.id = constructionTargets[constructionTarget].id
				newJob.action = 'construction'
				newJob.amount = constructionTargets[constructionTarget].hitsMax - constructionTargets[constructionTarget].hits
				newJob.assigned = []
				roomJobs.push(newJob);
			}
			
		}
		
	}
	
};

module.exports = loopCore;
