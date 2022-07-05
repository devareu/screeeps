var funcHelpers = require('func.helpers');
var funcBuildOrders =
{
	buildCenter: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName)
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x-1,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y-1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y-1, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y, STRUCTURE_ROAD);
		}
		if(thisRoomTerrain.get(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y+1) != TERRAIN_MASK_WALL)
		{
			room.createConstructionSite(myRoom.cityCenter.pos.x+1,myRoom.cityCenter.pos.y+1, STRUCTURE_ROAD);
		}
	},
	buildCenterToController: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		var goal = { pos: myRoom.controller.pos, range: 1}
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName)

		var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
		{
			plainCost: 5,
			swampCost: 5,
			roomCallback: function(roomName)
			{
				if (!room) return;
				let costs = new PathFinder.CostMatrix;
				room.find(FIND_STRUCTURES).forEach(function(struct)
				{
					if (struct.structureType === STRUCTURE_ROAD)
					{
						costs.set(struct.pos.x, struct.pos.y, 1);
					}
					else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
					{
						costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});
				return costs;
			},
		});
		for(var pathPoint in ret.path)
		{
			room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
			if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
			}
			if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
			{
				room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
			}
		}
		return 'completed'
	},
	buildCenterToSpawn: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		for(spawn in myRoom.spawns)
		{
			var goal = { pos: myRoom.spawns[spawn].pos, range: 0}
			var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
			{
				plainCost: 5,
				swampCost: 5,
				roomCallback: function(roomName)
				{
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(struct)
					{
						if (struct.structureType === STRUCTURE_ROAD)
						{
							costs.set(struct.pos.x, struct.pos.y, 1);
						}
						else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
						{
							costs.set(struct.pos.x, struct.pos.y, 0xff);
						}
					});
					return costs;
				},
			});
			for(var pathPoint in ret.path)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
			}
		}

		return 'completed'
	},
	buildCenterToSource: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		for(source in myRoom.sources)
		{
			var goal = { pos: myRoom.sources[source].pos, range: 0}
			var ret = PathFinder.search(myRoom.cityCenter.pos, goal,
			{
				plainCost: 5,
				swampCost: 5,
				roomCallback: function(roomName)
				{
					if (!room) return;
					let costs = new PathFinder.CostMatrix;
					room.find(FIND_STRUCTURES).forEach(function(struct)
					{
						if (struct.structureType === STRUCTURE_ROAD)
						{
							costs.set(struct.pos.x, struct.pos.y, 1);
						}
						else if (struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
						{
							costs.set(struct.pos.x, struct.pos.y, 0xff);
						}
					});
					return costs;
				},
			});
			for(var pathPoint in ret.path)
			{
				room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y, STRUCTURE_ROAD);
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x-1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y-1, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y, STRUCTURE_ROAD);
				}
				if(thisRoomTerrain.get(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1) != TERRAIN_MASK_WALL)
				{
					room.createConstructionSite(ret.path[pathPoint].x+1,ret.path[pathPoint].y+1, STRUCTURE_ROAD);
				}
			}
		}

		return 'completed'
	},
	buildSourceStorage: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		
		if (myRoom.sources.lengh > 1)
		{
			var newPoint = findPointInLine(myRoom.name, myRoom.sources[0].pos, myRoom.sources[1].pos,"50%")
		}
		
		room.createConstructionSite(posX,posY, STRUCTURE_STORAGE)
		let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,posX,posY)
		return found.id
	},
	buildUpgraderContainer: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		
		if (myRoom.sources.length > 1)
		{
			var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.controller.pos, myRoom.cityCenter.pos, 4)
			room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_CONTAINER)
			let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,newPoint.x,newPoint.y)
			return found.id
		}
		else
		{
			return "Single Sources Unhandled"
			console.log('Single Sources Unhandled')
		}
	},
	buildSpawnContainer: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]

		var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.spawns[0].pos, myRoom.cityCenter.pos, "2away")
		room.createConstructionSite(newPoint.x,newPoint.y, STRUCTURE_CONTAINER)
		let found = room.lookForAt(LOOK_CONSTRUCTION_SITES,newPoint.x,newPoint.y)
		return found[0].id
	},
	buildExtensions: function(roomName)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		var newPoint = funcHelpers.findPointInLine(myRoom.name, myRoom.spawns[0].pos, myRoom.cityCenter.pos, "-2away")
		console.log(newPoint.x,newPoint.y)
	}
};
module.exports = funcBuildOrders;