var funcHelpers =
{
	findAvailablePoint: function(roomName, pos)
	{
	},
	
	findLengthBetween: function(pos1,pos2)
	{
		let thisLength = Math.sqrt((Math.pow((pos1.x - pos2.x), 2) + (Math.pow((pos1.y - pos2.y), 2))))
		return thisLength
	},
	
	findPointInLine: function(roomName, pos1, pos2, task)
	{
		var myRoom = Memory.rooms.find(element => element.name == roomName);
		var room = Game.rooms[roomName]
		const thisRoomTerrain = Game.map.getRoomTerrain(roomName);
		
		let pointSeperation = Math.sqrt(Math.pow((pos2.x -pos1.x),2)+Math.pow((pos2.y -pos1.y),2))
		let lineSlope = (pos2.y - pos1.y)/(pos2.x-pos1.x)
		let lineYintercept = pos1.y - (lineSlope*pos1.x)
		var newPosX
		var newPosY
		switch (true)
		{
			case (isNaN(task)):
			{
				if(task.charAt(task.length) == '%')
				{
					let ratio = (task.slice(0,task.length - 1)/100)
					newPosX = Math.round(((1-ratio)*pos1.x)+(ratio*pos2.x))
					newPosY = Math.round(((1-ratio)*pos1.y)+(ratio*pos2.y))
					break;
				}
				else if(task.slice(task.length-4,task.length) == "away")
				{
					let awayBy = Number(task.replace(/away/,""))
					
					var goal = { pos: pos2, range: 0}
					var ret = PathFinder.search(pos1, goal,
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
					
					newPosX = ret.path[awayBy-1].x
					newPosY = ret.path[awayBy-1].y
					break;
				}
			}
			default:
			{
				let ratio = task/pointSeperation
				newPosX = Math.round(((1-ratio)*pos1.x)+(ratio*pos2.x))
				newPosY = Math.round(((1-ratio)*pos1.y)+(ratio*pos2.y))
				break;
			}
		}
		if(thisRoomTerrain.get(newPosX,newPosY) != TERRAIN_MASK_WALL)
		{
			return {x:newPosX,y:newPosY}
		}
		else
		{
			console.log('Point Blocked by Wall',newPosX,newPosY)
		}
	},
	
	findSourceLimit: function(pos)
	{
		const thisRoomTerrain = Game.map.getRoomTerrain(pos.roomName);
		let notWallCounter = 0
		if(thisRoomTerrain.get(pos.x - 1, pos.y - 1) != TERRAIN_MASK_WALL)//Left and Up
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x - 1, pos.y) != TERRAIN_MASK_WALL)//Left
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x - 1, pos.y + 1) != TERRAIN_MASK_WALL)//Left and Down
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x, pos.y - 1) != TERRAIN_MASK_WALL)//Up
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x, pos.y + 1) != TERRAIN_MASK_WALL)//Down
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x + 1, pos.y - 1) != TERRAIN_MASK_WALL)//Right and Up
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x + 1, pos.y) != TERRAIN_MASK_WALL)//Right
		{
			notWallCounter++
		}
		if(thisRoomTerrain.get(pos.x + 1, pos.y + 1) != TERRAIN_MASK_WALL)//Right and Down
		{
			notWallCounter++
		}
		return notWallCounter
		
	}
};

module.exports = funcHelpers;