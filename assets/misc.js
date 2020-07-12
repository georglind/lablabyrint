    // Build interactions.
    // this.interactions = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    // const objects = map.filterObjects('interactions', obj => obj.properties != undefined);
    // for (var i=0; i<objects.length; i++) {
    //     // parameters are x, y, width, height
    //     var zone = this.interactions.create(
    //       objects[i].x + objects[i].width / 2,
    //       objects[i].y + objects[i].height / 2,
    //       objects[i].width,
    //       objects[i].height,
    //     );

    //     for (var j=0; j<objects[i].properties.length; j++) {
    //       zone.setData(objects[i].properties[j].name, objects[i].properties[j].value)
    //     }
    // }

    // Text message.
    // this.text = this.add
    //   .text(8, 8, ``, {
    //     font: "16px monospace",
    //     fill: "#aaa",
    //     padding: { x: 15, y: 8 },
    //     backgroundColor: "#000000"
    //   })
    //   .setScrollFactor(0)
    //   .setDepth(12);

    // Lights
    // this.lights.enable().setAmbientColor(0x555555);

    // var lights = map.filterObjects('lights', obj => true);
    // for (var i=0; i<lights.length; i++) {
    //     // parameters are x, y
    //     var light = this.lights.addLight(lights[i].x, lights[i].y, 200).setIntensity(1.5);
    //     var ellipse = new Phaser.Geom.Ellipse(light.x, light.y, 8, 8);
    //     lights[i] = {light: light, ellipse: ellipse};
    // }

    // // Flickeing.
    // this.time.addEvent({
    //     delay: 200,
    //     callback: function ()
    //     {
    //         for (var i=0; i<lights.length;i++) {
    //           Phaser.Geom.Ellipse.Random(lights[i].ellipse, lights[i].light);
    //           lights[i].light.setIntensity(Phaser.Math.FloatBetween(1.4, 1.6));
    //         }
    //     },
    //     callbackScope: this,
    //     repeat: -1
    // });