/*global $:true, require:true, module:true */

var engine = (function() {
    "use strict";
    var that = {},
        engineTest,
        sceneList = {}, 
        sceneListCount = 0,
        currentScene,
        currentSceneName,
        currentMap,
        tileSize = 48,
        tilePadding = 2,
        testArea = $('#qunit-test-area'),
        Texture2D = require('cocos2d/Texture2D').Texture2D,
        cocos = require('cocos2d'),
        geo = require('geometry'),
        viewportWidth,
        viewportHeight,
        moveToWithStop = cocos.actions.MoveTo.extend({
            stop: function() {
                if (typeof this.runCallback === 'function') {
                    this.runCallback();
                }
                moveToWithStop.superclass.stop.call(this);
            }
        }),
        rotateByWithStop = cocos.actions.RotateBy.extend({
            stop: function() {
                if (typeof this.runCallback === 'function') {
                    this.runCallback();
                }
                rotateByWithStop.superclass.stop.call(this);
            }
        });
        
    that.tileSize = tileSize;
    
    that.initViewport = function(pixelsWidth, pixelsHeight) {
        testArea.css({'width': pixelsWidth, 'height': pixelsHeight});
        viewportWidth = pixelsWidth;
        viewportHeight = pixelsHeight;
        engineTest = cocos.nodes.Layer.extend({
            init: function() {
                engineTest.superclass.init.call(this);
                var director = cocos.Director.get('sharedDirector'),
                    s = director.get('winSize'),
                    label = cocos.nodes.Label.create({string: 'Test', fontName: 'Arial', fontSize: 76});
                this.addChild({child: label, z: 1});
                label.set('position', geo.ccp(s.width / 2, s.height / 2));
            }
        });
    };
    
    that.destroyViewport = function() {
        //testArea.empty();
        //cocos.Director.get('sharedDirector').replaceScene(currentScene);
    };
    
    that.prepareWorldData = function(xTiles, yTiles, callback) {
        if(xTiles != 48 || yTiles != 48){
            throw "Missing tmx map fixture for size: " + xTiles + "x" + yTiles;
        }
        //currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/orthogonal-test1.tmx"});
        currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/large48.tmx"});
        if (typeof callback === 'function') {
            callback();
        }
    };

    that.prepareWaterWorldData = function(xTiles, yTiles, callback) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/maps/img/tiles2.jpg"}),
            spriteFrames = [],
            framesCount = 8,
            tileCenterOffset = Math.round(that.tileSize / 2),
            entities = [],
            sprite,
            i,
            xPos,
            yPos,
            animation,
            animate;
        
        currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/empty.tmx"});
        
        // Prepare animation frames
        for (i = 0; i < framesCount; i++) {
            spriteFrames.push(cocos.SpriteFrame.create({
                texture: spriteTexture,
                rect: geo.rectMake(
                    (tileSize + tilePadding) * i, (tileSize + tilePadding) * 12, // x, y
                    tileSize + tilePadding, tileSize // sizex, sizey
                )
            }));
        }
        
        for (yPos = 0; yPos < yTiles; yPos++) {
            for (xPos = 0; xPos < xTiles; xPos++) {
                sprite = cocos.nodes.Sprite.create({frame: spriteFrames[0]});
                sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffset, yPos * tileSize + tileCenterOffset));
                animation = cocos.Animation.create({frames: spriteFrames, delay: 0.2});
                animate = cocos.actions.Animate.create({animation: animation, restoreOriginalFrame: false});
                sprite.runAction(cocos.actions.RepeatForever.create(animate));
                entities.push(sprite);
                //currentScene.addChild({child: sprite});
            }
        }
        
        that.worldData = entities;
        
        if (typeof callback === 'function') {
            callback();
        }
    };
    
    that.prepareWaterBckWorldData = function(xTiles, yTiles, callback) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/maps/img/tiles2.jpg"}),
            spriteFrames = [], framesCount = 8, tileCenterOffset = Math.round(that.tileSize / 2),
            entities = [], sprite;
        
        currentMap = cocos.nodes.TMXTiledMap.create({file: module.dirname + "/maps/empty.tmx"});
        that.worldData = entities;
        
        that.worldData.addBackground = function(sceneName){
            $('#'+sceneName).css({
                background: "url(/sprites/water.gif)"
            });
        };
        
        if (typeof callback === 'function') {
            callback();
        }
    };
    
    that.createScene = function(sceneName) {
        testArea.append('<div class="scene" id="' + sceneName + '"></div>');
        var sceneArea = $('#' + sceneName),
            director = cocos.Director.get('sharedDirector');
        sceneArea.css({'width': viewportWidth + 'px', 'height': viewportHeight + 'px'});
        director.attachInView($('#' + sceneName)[0]);
        sceneList[sceneName] = cocos.nodes.Scene.create();
        sceneListCount++;
        //$('.currentS1cene', testArea).remove();
    };
    
    that.showScene = function(sceneName, callback) {
        //director.set('displayFPS', true);
        var director = cocos.Director.get('sharedDirector'),
            label = cocos.nodes.Label.create({string: sceneName, fontName: 'Arial', fontSize: 24}),
            i;
        label.set('position', geo.ccp(100, 100));
        
        currentScene = sceneList[sceneName];
        currentSceneName = sceneName;
        currentScene.addChild({child: engineTest.create()});
        currentScene.addChild({child: currentMap, z: 0, tag: 1});
        currentScene.addChild({child: label, z: 2});
        
        if (that.worldData !== undefined) {
            for (i = 0; i < that.worldData.length; i++) {
                currentScene.addChild({child: that.worldData[i]});
            }
            that.worldData = undefined;
        }
        if (sceneListCount > 1) {
            $('.scene', testArea).not('#' + sceneName).remove();
            director.replaceScene(currentScene);
        } else {
            director.runWithScene(currentScene);
        }
        if (typeof callback === 'function') {
            callback();
        }
    };

    that.moveViewportTo = function(x, y, duration, callback) {
        var doAction = moveToWithStop.create({duration: (duration / 1000), position: geo.ccp(-x, -y)});
        doAction.set('runCallback', callback);
        currentMap.runAction(doAction);
    };

    function preparePlayer(xPos, yPos) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/sprites/kayak.png"}),
            spriteFrames = [], 
            framesCount = 10, 
            tileCenterOffset = Math.round(tileSize / 2),
            i,
            sprite;
        // Prepare animation frames
        for (i = 0; i < framesCount; i++) {
            spriteFrames.push(cocos.SpriteFrame.create({
                texture: spriteTexture,
                rect: geo.rectMake(
                    (tileSize + tilePadding) * i, 0, // x, y
                    tileSize + tilePadding, tileSize // sizex, sizey
                )
            }));
        }
        
        // Prepare one sprite
        sprite = cocos.nodes.Sprite.create({frame: spriteFrames[0]});
        sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffset, yPos * tileSize + tileCenterOffset));
        currentScene.addChild({child: sprite});
        
        sprite.moveTo = function(x, y, duration, callback) {
            var position = geo.ccp(x * tileSize + tileCenterOffset, y * tileSize + tileCenterOffset),
                moveAction = moveToWithStop.create({duration: (duration / 1000), position: position});

            moveAction.set('runCallback', callback);
            sprite.runAction(moveAction);
        };
        
        sprite.playAnimation = function() {
            var animation = cocos.Animation.create({frames: spriteFrames, delay: 0.2}),
                animate = cocos.actions.Animate.create({animation: animation, restoreOriginalFrame: false});

            sprite.runAction(cocos.actions.RepeatForever.create(animate));
        };
        return sprite;
    }
    
    function prepareCloud(xPos, yPos, spriteName) {
        var spriteTexture = Texture2D.create({file: module.dirname + "/sprites/" + spriteName +".png"}),
            spriteFrame, tileCenterOffsetX = Math.round(tileSize * 10 / 2)
            , tileCenterOffsetY = Math.round(tileSize * 5 / 2),
            sprite;
        // Prepare frame
        spriteFrame = cocos.SpriteFrame.create({
            texture: spriteTexture,
            rect: geo.rectMake(0, 0, // x, y
                tileSize*10, tileSize*5 // sizex, sizey
           )
        });
        // Prepare one sprite
        sprite = cocos.nodes.Sprite.create({frame: spriteFrame});
        sprite.set('position', geo.ccp(xPos * tileSize + tileCenterOffsetX, yPos * tileSize + tileCenterOffsetY));
        currentScene.addChild({child: sprite});
        
        sprite.moveTo = function(x, y, duration, callback) {
            var position = geo.ccp(x * tileSize + tileCenterOffsetX, y * tileSize + tileCenterOffsetY),
                moveAction = moveToWithStop.create({duration: (duration / 1000), position: position});

            moveAction.set('runCallback', callback);
            sprite.runAction(moveAction);
        };
        
        return sprite;
    }
    
    that.putEntity = function(xPos, yPos, spriteName) {
        var sprite;
        switch(spriteName){
            case "player":
                sprite = preparePlayer(xPos, yPos);
                break;
            case "cloudshigh":
            case "cloudslow":
                sprite = prepareCloud(xPos, yPos, spriteName);
                break;
        }

        sprite.rotate = function(angle, duration, x, y, callback) {
            var rotation = rotateByWithStop.create({duration: (duration / 1000), angle: angle});
            rotation.set('runCallback', callback);
            sprite.set('anchorPointInPixels', geo.ccp(x, y));
            sprite.runAction(rotation);
        };
        
        sprite.setZ = function(z) {
            currentScene.reorderChild({child: sprite, z: z});
        };
        
        return sprite;
    };
    
    that.putText = function(text){
        var label = cocos.nodes.Label.create({
            string: text.text,
            fontName: text.properites['font-family'],
            fontSize: parseInt(text.properites['font-size'], 10)
        });
        this.addChild({child: label, z: 1});
        label.set('position', geo.ccp(text.position.x, text.position.y));
    };
    return that;
}());

module.exports = engine;
