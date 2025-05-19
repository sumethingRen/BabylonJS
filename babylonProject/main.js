var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Kamera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -15), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // Pencahayaan
    var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
    light.position = new BABYLON.Vector3(5, 10, 5);
    light.intensity = 0.7;

    // Shadow generator
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Parent transform node
    var chair = new BABYLON.TransformNode("chair", scene);

    // Dudukan
    var seat = BABYLON.MeshBuilder.CreateBox("seat", { width: 2, height: 0.3, depth: 2 }, scene);
    seat.position.y = 1.5;
    seat.parent = chair;
    shadowGenerator.addShadowCaster(seat);

    // Sandaran
    var backrest = BABYLON.MeshBuilder.CreateBox("backrest", { width: 2, height: 2, depth: 0.3 }, scene);
    backrest.position.y = 2.65;
    backrest.position.z = -0.85;
    backrest.parent = chair;
    shadowGenerator.addShadowCaster(backrest);

    // Kaki kursi
    var leg1 = BABYLON.MeshBuilder.CreateCylinder("leg1", { diameter: 0.2, height: 1.5 }, scene);
    leg1.position.set(-0.8, 0.75, -0.8);
    leg1.parent = chair;
    shadowGenerator.addShadowCaster(leg1);

    var leg2 = leg1.clone("leg2");
    leg2.position.z = 0.8;
    leg2.parent = chair;
    shadowGenerator.addShadowCaster(leg2);

    var leg3 = leg1.clone("leg3");
    leg3.position.x = 0.8;
    leg3.position.z = -0.8;
    leg3.parent = chair;
    shadowGenerator.addShadowCaster(leg3);

    var leg4 = leg1.clone("leg4");
    leg4.position.x = 0.8;
    leg4.position.z = 0.8;
    leg4.parent = chair;
    shadowGenerator.addShadowCaster(leg4);

    // Rotasi awal
    chair.rotation.y = BABYLON.Angle.FromDegrees(135).radians();

    // Lantai
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
    ground.receiveShadows = true;

    // Fungsi lompat
    function makeChairJump(target) {
        var jumpAnim = new BABYLON.Animation("jump", "position.y", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keys = [];
        var startY = target.position.y;
        keys.push({ frame: 0, value: startY });
        keys.push({ frame: 10, value: startY + 2 }); // naik
        keys.push({ frame: 20, value: startY });     // turun
        jumpAnim.setKeys(keys);

        target.animations = [];
        target.animations.push(jumpAnim);

        scene.beginAnimation(target, 0, 20, false);
    }

    // Interaktif: klik pada seat → lompatkan seluruh chair
    seat.actionManager = new BABYLON.ActionManager(scene);
    seat.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
            makeChairJump(chair);
        })
    );

    // Rotasi otomatis
    scene.registerBeforeRender(function () {
        chair.rotation.y += BABYLON.Tools.ToRadians(0.2);
    });

    return scene;
};
