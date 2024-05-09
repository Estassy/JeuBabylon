/*
// //let obstacleModele = MeshBuilder.CreateBox("obstacle", { width: 0.5, height: 1, depth: 1 }, this.scene);
        // res = await SceneLoader.ImportMeshAsync("", "", obstacle1Url, this.scene);
        // let obstacleModele = res.meshes[0];


        // for (let i = 0; i < NB_OBSTACLES; i++) {
        //     let obstacle = obstacleModele.clone("");
        //     obstacle.normalizeToUnitCube();


        //     let w = Scalar.RandomRange(.5, 1.5);
        //     let d = Scalar.RandomRange(.5, 1.5);
        //     let h = Scalar.RandomRange(.5, 1.5);
        //     obstacle.scaling.set(w, h, d);

        //     let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
        //     let z = Scalar.RandomRange(SPAWN_POS_Z - 15, SPAWN_POS_Z + 15);
        //     obstacle.position.set(x, 0, z);

        //     let childMeshes = obstacle.getChildMeshes();

        //     let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
        //     let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;

        //     for (let i = 0; i < childMeshes.length; i++) {
        //         let mat = new StandardMaterial("mat", this.scene);
        //         mat.emissiveColor = new Color4(.3, .3, Scalar.RandomRange(.5, .8));
        //         mat.alpha = 0.5;

        //         childMeshes[i].material = mat;

        //         let meshMin = childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
        //         let meshMax = childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;


        //         min = Vector3.Minimize(min, meshMin);
        //         max = Vector3.Maximize(max, meshMax);
        //     }
        //     obstacle.setBoundingInfo(new BoundingInfo(min, max));

        //     obstacle.showBoundingBox = false;
        //     obstacle.checkCollisions = true;
        //     obstacle.collisionGroup = 2;

        //     this.obstacles.push(obstacle);
        // }
        // obstacleModele.dispose;

        async initializeObstacles() {
        for (let i = 0; i < NB_OBSTACLES; i++) {
            // Choisir aléatoirement un type d'obstacle
            let obstacleTypeUrl = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
            let res = await SceneLoader.ImportMeshAsync("", "", obstacleTypeUrl, this.scene);
            let obstacle = res.meshes[0];

            // Ajuster la taille de l'obstacle
            obstacle.normalizeToUnitCube();
            obstacle.scaling.set(
                Scalar.RandomRange(0.5, 1.5),
                Scalar.RandomRange(0.5, 1.5),
                Scalar.RandomRange(0.5, 1.5)
            );

            // Positionner aléatoirement l'obstacle
            let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
            let z = Scalar.RandomRange(SPAWN_POS_Z - 15, SPAWN_POS_Z + 15);
            obstacle.position.set(x, 0, z);

            // Configurer les collisions
            obstacle.checkCollisions = true;
            obstacle.collisionGroup = 2;

            // Ajouter l'obstacle à la liste
            this.obstacles.push(obstacle);
        }
    }
*/