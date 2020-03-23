const x = window.innerWidth / 2;
const y = window.innerHeight * 0.5;
const engine = Matter.Engine.create();
const world = engine.world;
const render = Matter.Render.create({
  element: document.body,
  engine,
  options: {
    background: window.COLORS.white,
    wireframes: false,
    height: window.innerHeight,
    width: window.innerWidth,
    showAngleIndicator: false } });


const bodies = {};
const baseProps = Matter.Common.extend({
  friction: 1,
  frictionAir: 0.01,
  collisionFilter: {
    group: Matter.Body.nextGroup(true) } });



const bits = {
  rightLowerLeg: { x: 22, y: 114, width: 31, height: 91, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-leg-lower.png' },
  rightUpperLeg: { x: 22, y: 65, width: 35, height: 66, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-leg-upper.png' },
  leftLowerLeg: { x: -22, y: 114, width: 31, height: 91, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-leg-lower.png' },
  leftUpperLeg: { x: -22, y: 65, width: 35, height: 66, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-leg-upper.png' },
  chest: { width: 91, height: 117, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-chest.png' },
  rightLowerArm: { x: 30, y: 35, width: 28, height: 66, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-arm-lower-left.png' },
  rightUpperArm: { x: 32, y: -7, width: 31, height: 61, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-arm-upper.png' },
  leftLowerArm: { x: -30, y: 35, width: 28, height: 66, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-arm-lower.png' },
  leftUpperArm: { x: -32, y: -7, width: 31, height: 61, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-arm-upper.png' },
  head: { y: -88, width: 110, height: 113, texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/59639/ci-head.png' } };

const bitConstraints = [
{
  bodyA: 'head',
  bodyB: 'chest',
  pointA: { x: 0, y: 25 },
  pointB: { x: 0, y: -40 } },

{
  bodyA: 'chest',
  bodyB: 'rightUpperArm',
  pointA: { x: 38, y: -23 },
  pointB: { x: 0, y: -8 } },

{
  bodyA: 'chest',
  bodyB: 'leftUpperArm',
  pointA: { x: -38, y: -23 },
  pointB: { x: 0, y: -8 } },

{
  bodyA: 'chest',
  bodyB: 'rightUpperLeg',
  pointA: { x: 10, y: 30 },
  pointB: { x: 0, y: -10 } },

{
  bodyA: 'chest',
  bodyB: 'leftUpperLeg',
  pointA: { x: -10, y: 30 },
  pointB: { x: 0, y: -10 } },

{
  bodyA: 'rightUpperArm',
  bodyB: 'rightLowerArm',
  pointA: { x: 0, y: 15 },
  pointB: { x: 0, y: -20 } },

{
  bodyA: 'leftUpperArm',
  bodyB: 'leftLowerArm',
  pointA: { x: 0, y: 15 },
  pointB: { x: 0, y: -20 } },

{
  bodyA: 'rightUpperLeg',
  bodyB: 'rightLowerLeg',
  pointA: { x: 0, y: 20 },
  pointB: { x: 0, y: -30 } },

{
  bodyA: 'leftUpperLeg',
  bodyB: 'leftLowerLeg',
  pointA: { x: 0, y: 20 },
  pointB: { x: 0, y: -30 } },

{
  bodyA: 'leftLowerLeg',
  bodyB: 'rightLowerLeg',
  pointA: { x: 0, y: 0 },
  pointB: { x: 0, y: 0 },
  stiffness: 0.01 }];



for (let key in bits) {
  const bit = bits[key];
  bodies[key] = Matter.Bodies.rectangle(
  x + (bit.x || 0),
  y + (bit.y || 0),
  bit.width || 0,
  bit.height || 0,
  { ...baseProps,
    label: key,
    render: {
      fillStyle: bit.texture ? 'transparent' : '#f00',
      strokeStyle: 'transparent',
      visible: true,
      sprite: {
        texture: bit.texture || '',
        xScale: 0.5,
        yScale: 0.5 } } });



}

const puppet = Matter.Composite.create({
  bodies: Object.values(bodies),
  constraints: bitConstraints.map(({ bodyA, bodyB, pointA, pointB, stiffness }) => Matter.Constraint.create({
    bodyA: bodies[bodyA],
    bodyB: bodies[bodyB],
    pointA, pointB,
    stiffness: stiffness || 0.6,
    render: { visible: false } })) });



const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.6,
    length: 0,
    angularStiffness: 0,
    render: {
      visible: false } } });




Matter.World.add(world, [
mouseConstraint,
puppet,
Matter.Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true, render: { visible: false } }),
Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true, render: { visible: false } }),
Matter.Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true, render: { visible: false } }),
Matter.Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true, render: { visible: false } })]);


Matter.Engine.run(engine);
Matter.Render.run(render);
