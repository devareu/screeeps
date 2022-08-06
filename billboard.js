var billboard = {

    build: function()
	{
		//Base Square for the Whole Thing
		let roomCount = Memory.rooms.length
		new RoomVisual().rect(0, 0, 14.75, roomCount+1.75, {fill: '#ffffff',opacity: '.5', stroke: 'white'}); 
		new RoomVisual().text('Name', 0.125, 1, {color: 'blue', font: '1.0 WarHeliosCondCBold', align: 'Left'});
		new RoomVisual().line(.125,1.1,2.3,1.1, {width: .1, color: 'black', opacity: 1})
		new RoomVisual().text('Rcl', 3, 1, {color: 'blue', font: '1.0 WarHeliosCondCBold', align: 'Left'});
		new RoomVisual().line(3,1.1,4.25,1.1, {width: .1, color: 'black', opacity: 1})
		new RoomVisual().text('Lst', 5, 1, {color: 'blue', font: '1.0 WarHeliosCondCBold', align: 'Left'});
		new RoomVisual().line(5,1.1,6.25,1.1, {width: .1, color: 'black', opacity: 1})
		new RoomVisual().text('Avg', 7, 1, {color: 'blue', font: '1.0 WarHeliosCondCBold', align: 'Left'});
		new RoomVisual().line(7,1.1,8.25,1.1, {width: .1, color: 'black', opacity: 1})
		new RoomVisual().text('Phase', 11, .5, {color: 'blue', font: '.5 WarHeliosCondCBold', align: 'Center'});
		new RoomVisual().text('Rcl Porgress | Spawn Nrg', 9, 1, {color: 'blue', font: '.5 WarHeliosCondCBold', align: 'Center'});
		new RoomVisual().line(9,1.1,13,1.1, {width: .1, color: 'black', opacity: 1})
		
		//display all rooms summary data
		let rowCounter = 2
		for(room in Memory.rooms)
		{
			let myRoom = Memory.rooms[room]
			let thisRoom = Game.rooms[myRoom.name]
			
			let fontColor = 'green'
			if(myRoom.defcon != 0)
			{
				fontColor = 'red'
			}
			new RoomVisual().text(Memory.rooms[room].name, 0.125, rowCounter, {color: fontColor, font:'1.0 WarHeliosCondCBold', align:'left'});
			let roomRclColor = ''
			switch (true)
			{			
				case thisRoom.controller.level == 1 && thisRoom.controller.ticksToDowngrade < 18000:
				case thisRoom.controller.level == 2 && thisRoom.controller.ticksToDowngrade < 9000:
				case thisRoom.controller.level == 3 && thisRoom.controller.ticksToDowngrade < 18000:
				case thisRoom.controller.level == 4 && thisRoom.controller.ticksToDowngrade < 36000:
				case thisRoom.controller.level == 5 && thisRoom.controller.ticksToDowngrade < 72000:
				case thisRoom.controller.level == 6 && thisRoom.controller.ticksToDowngrade < 108000:
				case thisRoom.controller.level == 7 && thisRoom.controller.ticksToDowngrade < 150000:
				case thisRoom.controller.level == 8 && thisRoom.controller.ticksToDowngrade < 180000:
				{
					roomRclColor = 'red'
					break;
				}
				default:
				{
					roomRclColor = 'blue'
					break;
				}
			}


			new RoomVisual().text(thisRoom.controller.level, 3.5, rowCounter, {color: roomRclColor, font: '1.0 WarHeliosCondCBold', align:'left'});
			new RoomVisual().text(myRoom.reportData.gclLastTick,5.5, rowCounter, {color: 'blue', font: '1.0 WarHeliosCondCBold', align:'left'});
			new RoomVisual().text(myRoom.reportData.gclAvg, 7.5, rowCounter, {color: 'blue', font: '1.0 WarHeliosCondCBold', align:'left'});
			
			let phaseCounter = 9
			let thisPhase = phaseCounter
			
			for(let step = 0; step < 5; step++)
			{
				new RoomVisual().line(thisPhase,rowCounter-.5,thisPhase+1,rowCounter-.5, {width: .25, color: 'Blue', lineStyle:'dotted', opacity: 1})
				thisPhase = thisPhase+1.125
			}
			thisPhase = phaseCounter
			for(let step = 0; step < Memory.rooms[room].phase; step++)
			{
				new RoomVisual().line(thisPhase,rowCounter-.5,thisPhase+1,rowCounter-.5, {width: .25, color: 'green', opacity: 1})
				thisPhase = thisPhase+1.125
			}
			
			//Room Control Progress
			let barProg = 0
			if(thisRoom.controller.level == 8)
			{
				barProg = 1
			}
			else
			{
				barProg = (thisRoom.controller.progress / thisRoom.controller.progressTotal)
			}
			new RoomVisual().line(phaseCounter,rowCounter,phaseCounter,rowCounter, {width: .25, color: 'black', opacity: 1})
			new RoomVisual().line(phaseCounter,rowCounter,phaseCounter+barProg,rowCounter, {width: .25, color: 'blue', opacity: 1})
			
			//Spawn Energy Bar
			let barAvail = (thisRoom.energyAvailable / thisRoom.energyCapacityAvailable)
			new RoomVisual().line(phaseCounter+1.125,rowCounter,phaseCounter+2.125,rowCounter, {width: .25, color: 'black', opacity: 1})
			new RoomVisual().line(phaseCounter+1.125,rowCounter,phaseCounter+1+barAvail,rowCounter, {width: .25, color: 'pink', opacity: 1})
			
			if(thisRoom.controller.level != 8)
			{
				let thisBarGcl = 14.7 * (thisRoom.controller.progress / thisRoom.controller.progressTotal)
				new RoomVisual().line(.05,rowCounter+.125,14.75,rowCounter+.125, {width: .125, color: 'black', opacity: 1})
				new RoomVisual().line(.05,rowCounter+.125,thisBarGcl,rowCounter+.125, {width: .125, color: 'green', opacity: 1})
			}
			else
			{
				new RoomVisual().line(.05,rowCounter+.125,14.75,rowCounter+.125, {width: .125, color: 'green', opacity: 1})
			}
			
			rowCounter++
		}
		
		let barGcl = 14.7 * (Game.gcl.progress / Game.gcl.progressTotal)
		new RoomVisual().line(.05,rowCounter-.5,14.75,rowCounter-.5, {width: .5, color: 'black', opacity: 1})
		new RoomVisual().line(.05,rowCounter-.5,barGcl,rowCounter-.5, {width: .5, color: 'crimson', opacity: 1})
		new RoomVisual().text(Math.ceil(Game.gcl.progress) + ' / ' + Math.ceil(Game.gcl.progressTotal),14.7/2,rowCounter-.27,{color: 'white', font: 'bold .7 Ariel'})
		
		
		/*
		data.gclAvg
		data.gclLastTick
		*/
    }
};
module.exports = billboard;