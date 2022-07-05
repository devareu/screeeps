var funcHelpers =
{
	findAvailablePoint: function(roomName, pos)
	{
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
		console.log(pos1.x,pos1.y,pos2.x,pos2.y)
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
					console.log(awayBy)
					switch (true)
					{
						case (pos1.x == pos2.x && pos1.y < pos2.y)://1 is up, x, y++ 
						{							
							newPosX = Number(pos1.x)
							newPosY = Number(pos1.y) - awayBy
							break;
						}
						case (pos1.x > pos2.x && pos1.y < pos2.y)://1 is up and right, x--, y++ 
						{							
							newPosX = Number(pos1.x) - awayBy
							newPosY = Number(pos1.y) - awayBy
							break;
						}
						case (pos1.x > pos2.x && pos1.y == pos2.y)://1 is right, x--, y
						{							
							newPosX = Number(pos1.x) - awayBy
							newPosY = Number(pos1.y) - awayBy
							break;
						}
						case (pos1.x > pos2.x && pos1.y > pos2.y)://1 is down and right, x--, y--
						{							
							newPosX = Number(pos1.x) - awayBy
							newPosY = Number(pos1.y) - awayBy
							break;
						}
						case (pos1.x == pos2.x && pos1.y < pos2.y)://1 is down, x, y-- 
						{							
							newPosX = Number(pos1.x)
							newPosY = Number(pos1.y) + awayBy
							break;
						}
						case (pos1.x < pos2.x && pos1.y < pos2.y)://1 is down and left, x++, y--
						{							
							newPosX = Number(pos1.x) + awayBy
							newPosY = Number(pos1.y) + awayBy
							break;
						}
						case (pos1.x < pos2.x && pos1.y == pos2.y)://1 is left, x++, y 
						{							
							newPosX = Number(pos1.x) + awayBy
							newPosY = Number(pos1.y)
							break;
						}
						case (pos1.x < pos2.x && pos1.y < pos2.y)://1 is up and left, x++, y++
						{							
							newPosX = Number(pos1.x) + awayBy
							newPosY = Number(pos1.y) - awayBy
							break;
						}
						case (pos1.x == pos2.x && pos1.y < pos2.y)://1 is up, Go Down
						{							
							newPosX = Number(pos1.x)
							newPosY = Number(pos1.y) - awayBy
							break;
						}
					}
					console.log(newPosX,newPosY)
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
			console.log('Point Blocked by Wall')
		}
	}
};

module.exports = funcHelpers;