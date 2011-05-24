module("Viewport", {
    setup: function(){
        engine.initViewport(1000, 700); // in pixels
    },
    teardown: function(){
        engine.destroyViewport();
    }
});

asyncTest('Move viewport', 1, function() {
    engine.prepareWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var startTime;
        setTimeout(function(){
            startTime = new Date();
            engine.moveViewportTo(600, 600, 3000, function(){
                var stopTime = new Date();
                var delta = stopTime.getTime() - startTime.getTime();
                ok(delta < 3020 && delta > 2980, "Animation was performed in resonable time 2980 < " + delta + " < 3020 ");
                start();
            });
        }, 500);
        
    });
});

asyncTest('Switch scene', 1, function() {
    engine.prepareWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        engine.createScene('scene2');
        setTimeout(function(){
            var startTime = new Date();
            engine.showScene('scene2', function(){
                var stopTime = new Date();
                ok((stopTime.getTime() - startTime.getTime()) < 1000, 'Render time: ' + (stopTime.getTime() - startTime.getTime()));
                start();
            });
        }, 500);
    });
});

asyncTest('Moving non-animated sprite on map', 1, function() {
    engine.prepareWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var startTime;
        var entity = engine.putEntity(0, 0, 'player');
        setTimeout(function(){
            startTime = new Date();
            entity.moveTo(15, 10, 10000, function() {
                var stopTime = new Date();
                var delta = (stopTime.getTime() - startTime.getTime());
                ok( 9900 < delta && delta < 10100, "Sprite moved in about 10 seconds (" + delta + ")");
                start();
            });
        }, 500);
    });
});

asyncTest('Moving 50 non-animated sprites on map', 50, function() {
    engine.prepareWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var i,j, entities = [];
        for(i = 0; i< 10; i++){
            for(j=0; j<5; j++){
                entities.push({
                    start:{x:i*2-(j%2),y:(j%2)*10+j},
                    finish:{x:i*2-(j%2), y:((j+1)%2)*10+j}
                });
            }
        }
        setTimeout(function(){
            for( n=0; n < entities.length; n++){
                (function(){
                    var startTime;
                    var entity = engine.putEntity(entities[n].start.x, entities[n].start.y, 'player');
                    startTime = new Date();
                    entity.moveTo(entities[n].finish.x, entities[n].finish.y, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 4900 < delta && delta < 5100, "Sprite moved in about 5 seconds (" + delta + ")");
                    });
                })();
            }
            setTimeout(function(){start();}, 6000);
        }, 1000);
    });
});

asyncTest('Moving aminated sprite on map', function(){
    engine.prepareWorldData(48, 48, function() {
        engine.createScene('scene1');
        engine.showScene('scene1');
        setTimeout(function() {
            var startTime;
            var entity = engine.putEntity(1, 1, 'player');
            startTime = new Date();
            entity.playAnimation();
            entity.moveTo(1, 8, 5000, function() {
                entity.rotate(-90, 1000, function() {
                    entity.moveTo(8,8, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 10900 < delta && delta < 11100, "Animated sprite moved in about 11 seconds (" + delta + ")");
                        start();
                    })
                });
            });
        }, 1000);
    });
});

asyncTest('Moving 50 aminated sprites on map', 50, function() {
    engine.prepareWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var i,j, entities = [];
        for(i = 0; i< 10; i++){
            for(j=0; j<5; j++){
                entities.push({
                    start:{x:i*2-(j%2),y:(j%2)*10+j},
                    finish:{x:i*2-(j%2), y:((j+1)%2)*10+j}
                });
            }
        }
        setTimeout(function(){
            for( n=0; n < entities.length; n++){
                (function(){
                    var startTime;
                    var entity = engine.putEntity(entities[n].start.x, entities[n].start.y, 'player');
                    entity.playAnimation();
                    startTime = new Date();
                    entity.moveTo(entities[n].finish.x, entities[n].finish.y, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 4900 < delta && delta < 5100, "Animated sprite moved in about 5 seconds (" + delta + ")");
                    });
                })();
            }
            setTimeout(function(){start();}, 6000);
        }, 1000);
    });
});

asyncTest('Moving 50 aminated sprites on animated map', 50, function() {
    engine.prepareWaterWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var i,j, entities = [];
        for(i = 0; i< 10; i++){
            for(j=0; j<5; j++){
                entities.push({
                    start:{x:i*2-(j%2),y:(j%2)*10+j},
                    finish:{x:i*2-(j%2), y:((j+1)%2)*10+j}
                });
            }
        }
        setTimeout(function(){
            for( n=0; n < entities.length; n++){
                (function(){
                    var startTime;
                    var entity = engine.putEntity(entities[n].start.x, entities[n].start.y, 'player');
                    entity.playAnimation();
                    startTime = new Date();
                    entity.moveTo(entities[n].finish.x, entities[n].finish.y, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 4900 < delta && delta < 5100, "Animated sprite moved in about 5 seconds (" + delta + ")");
                    });
                })();
            }
            setTimeout(function(){start();}, 6000);
        }, 1000);
    });
});

asyncTest('Moving 50 aminated sprites on animated background', 50, function() {
    engine.prepareWaterBckWorldData(48,48, function(){
        engine.createScene('scene1');
        engine.showScene('scene1');
        var i,j, entities = [];
        for(i = 0; i< 10; i++){
            for(j=0; j<5; j++){
                entities.push({
                    start:{x:i*2-(j%2),y:(j%2)*10+j},
                    finish:{x:i*2-(j%2), y:((j+1)%2)*10+j}
                });
            }
        }
        setTimeout(function(){
            for( n=0; n < entities.length; n++){
                (function(){
                    var startTime;
                    var entity = engine.putEntity(entities[n].start.x, entities[n].start.y, 'player');
                    entity.playAnimation();
                    startTime = new Date();
                    entity.moveTo(entities[n].finish.x, entities[n].finish.y, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 4900 < delta && delta < 5100, "Animated sprite moved in about 5 seconds (" + delta + ")");
                    });
                })();
            }
            setTimeout(function(){start();}, 6000);
        }, 1000);
    });
});

asyncTest('Moving 50 aminated sprites on animated background and static map', 50, function() {
    engine.prepareMixedWorldData(48,48, function() {
        engine.createScene('scene1');
        engine.showScene('scene1');
        var i, j, entities = [];
        for(i = 0; i< 10; i++){
            for(j=0; j<5; j++){
                entities.push({
                    start:{x:i*2-(j%2),y:(j%2)*10+j},
                    finish:{x:i*2-(j%2), y:((j+1)%2)*10+j}
                });
            }
        }
        setTimeout(function(){
            for( n=0; n < entities.length; n++){
                (function(){
                    var startTime;
                    var entity = engine.putEntity(entities[n].start.x, entities[n].start.y, 'player');
                    entity.playAnimation();
                    startTime = new Date();
                    entity.moveTo(entities[n].finish.x, entities[n].finish.y, 5000, function() {
                        var stopTime = new Date();
                        var delta = (stopTime.getTime() - startTime.getTime());
                        ok( 4900 < delta && delta < 5100, "Animated sprite moved in about 5 seconds (" + delta + ")");
                    });
                })();
            }
            setTimeout(function(){start();}, 6000);
        }, 1000);
    });
});

asyncTest('Move 2 large non-animated objects', 4, function() {
    engine.prepareWorldData(48,48, function() {
        engine.createScene('scene1');
        engine.showScene('scene1');
        setTimeout(function() {
            var clouds1 = engine.putEntity(0, 0, 'cloudshigh'),
                clouds2 = engine.putEntity(10, 10, 'cloudslow'),
                startTime = new Date();
            clouds1.setZ(1);
            clouds2.setZ(2);
            clouds1.moveTo(10, 10, 5000, function() {
                var stopTime = new Date();
                var delta = (stopTime.getTime() - startTime.getTime());
                ok( 4900 < delta && delta < 5100, "Gray large object moved in about 5 seconds (" + delta + ")");
            });
            clouds2.moveTo(0, 0, 5000, function() {
                var stopTime = new Date();
                var delta = (stopTime.getTime() - startTime.getTime());
                ok( 4900 < delta && delta < 5100, "Blue large object moved in about 5 seconds (" + delta + ")");
            });
            setTimeout(function() {
                clouds1.setZ(2);
                clouds2.setZ(1);
                startTime = new Date();
                clouds1.moveTo(0, 0, 5000, function() {
                    var stopTime = new Date();
                    var delta = (stopTime.getTime() - startTime.getTime());
                    ok( 4900 < delta && delta < 5100, "Gray large object moved in about 5 seconds (" + delta + ")");
                });
                clouds2.moveTo(10, 10, 5000, function() {
                    var stopTime = new Date();
                    var delta = (stopTime.getTime() - startTime.getTime());
                    ok( 4900 < delta && delta < 5100, "Blue large object moved in about 5 seconds (" + delta + ")");
                });
                setTimeout(function() {
                    start();
                }, 5500);
            }, 5500);
        }, 1000);
    });
});
asyncTest('Rotate 50 small objects over map', 50, function() {
    engine.prepareWorldData(48, 48, function() {
        engine.createScene('sc1');
        engine.showScene('sc1');
        var i, j, entities = [];
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 5; j++) {
                entities.push({
                    theta: 360, originX: 24, originY: 24,
                    position: {
                        x: i * 2 - (j % 2) + 1,
                        y: (j % 2) * 2 + j
                    }
                })
            }
        }
        setTimeout(function() {
            for (i = 0; i < entities.length; i++) {
                (function() {
                    var player = engine.putEntity(entities[i].position.x, entities[i].position.y, 'player'),
                        startTime = new Date();
                    player.rotate(entities[i].theta,
                                  5000,
                                  entities[i].originX,
                                  entities[i].originY,
                                  function() {
                        var stopTime = new Date(),
                            delta = stopTime.getTime() - startTime.getTime();
                        ok(4900 < delta && delta < 5100, 'Small object rotated in about 5 seconds (' + delta + ')');
                    });
                    setTimeout(function() {start();}, 6000);
                })();
            }
        }, 1000);
    })
});
asyncTest('Rotate 2 large objects over map', 2, function() {
    engine.prepareWorldData(48, 48, function() {
        engine.createScene('sc1');
        engine.showScene('sc1');
        setTimeout(function() {
            var cloud1 = engine.putEntity(2, 2, 'cloudshigh'),
                cloud2 = engine.putEntity(7, 7, 'cloudslow'),
                startTime = new Date();
            cloud1.rotate(360, 5000, 240, 120, function() {
                var stopTime = new Date(),
                    delta = stopTime.getTime() - startTime.getTime();
                ok(4900 < delta && delta < 5100, 'Large object rotated in about 5 seconds (' + delta + ')');
            });
            cloud2.rotate(360, 5000, 240, 120, function() {
                var stopTime = new Date(),
                    delta = stopTime.getTime() - startTime.getTime();
                ok(4900 < delta && delta < 5100, 'Large object rotated in about 5 seconds (' + delta + ')');
            });
            setTimeout(function() {start();}, 6000);
        }, 1000);
    })
});
asyncTest('Show texts', 3, function() {
    var theFont = 'Arial',
        fontSize = '12px',
        textLeft = {
            text: 'This is a sample text aligned left.',
            properites: {'text-align': 'left', 'font-family': theFont, 'font-size': fontSize},
            position: {w: 300, h: 20, x: 10, y: 10}
        },
        textCenter = {
            text: 'This is a sample text aligned center.',
            properites: {'text-align': 'center', 'font-family': theFont, 'font-size': fontSize},
            position: {w: 300, h: 20, x: 10, y: 40}
        },
        textRight = {
            text: 'This is a sample text aligned right.',
            properites: {'text-align': 'right', 'font-family': theFont, 'font-size': fontSize},
            position: {w: 300, h: 20, x: 10, y: 70}
        };
    //engine.createScene('textScene');
    //engine.showScene('textScene');
    setTimeout(function() {
        engine.putText(textLeft);
        engine.putText(textCenter);
        engine.putText(textRight);
        setTimeout(function() {
            ok($('*:contains("' + textLeft.text + '"):last').text() === textLeft.text, 'Text aligned left found');
            ok($('*:contains("' + textCenter.text + '"):last').text() === textCenter.text, 'Centered text found');
            ok($('*:contains("' + textRight.text + '"):last').text() === textRight.text, 'Text aligned right found');
            start();
        }, 500);
    }, 1000);
});