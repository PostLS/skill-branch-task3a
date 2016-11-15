import express from "express";
import cors from "cors";
import fetch from "isomorphic-fetch";

const app = express();
app.use(cors());

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};
fetch(pcUrl)
  .then(async (res) => {
  	pc = await res.json();
  		app.get("/task3a/:id1?/:id2?/:id3?", (req, res) => {
		const id1 = req.params.id1;
		const id2 = req.params.id2;
		const id3 = req.params.id3;
		if(id1 === undefined) {
			res.send(pc);
		} else if(id1 === 'volumes') {
			const volumes = {};
			for(var i = 0; i < pc.hdd.length; i++) {
				if(!(pc.hdd[i].volume in volumes)) {
					volumes[pc.hdd[i].volume] = pc.hdd[i].size;
				} else if(pc.hdd[i].volume in volumes) {
					volumes[pc.hdd[i].volume] += pc.hdd[i].size;
				}
			}
			for(var key in volumes) {
				volumes[key] += "B";
			}
			res.send(JSON.stringify(volumes, ""));
		} else if(id1 !== undefined && id2 == undefined) {
			if(Object.keys(pc).indexOf(id1) >= 0) {
				res.send(JSON.stringify(pc[id1], ""));
			} else {
				res.status(404).send("Not Found");
			}
		} else if(id2 !== undefined && id3 === undefined) {
			if(Object.keys(pc).indexOf(id1) >= 0 && Object.keys(pc[id1]).indexOf(id2) >= 0) {
				res.send(JSON.stringify(pc[id1][id2], ""));
			} else {
				res.status(404).send("Not Found");
			}
		} else if(id3 !== undefined) {
			if(Object.keys(pc).indexOf(id1) >= 0 && Object.keys(pc[id1]).indexOf(id2) >= 0 && Object.keys(pc[id1][id2]).indexOf(id3) >= 0) {
				res.send(JSON.stringify(pc[id1][id2][id3], ""));
			} else {
				res.status(404).send("Not Found");
			}
		}
	});
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

app.listen(3000, function() {
	console.log("Listening 3000");
});