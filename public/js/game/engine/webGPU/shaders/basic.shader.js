export const shaders = `
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f,
  @location(1) texCoord : vec2f
}

@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f,
               @location(2) texCoord: vec2f) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
  output.color = color;
  output.texCoord = texCoord;
  return output;
}

@group(0) @binding(0) var myTexture: texture_2d<f32>;
@group(0) @binding(1) var mySampler: sampler;

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  let texColor = textureSample(myTexture, mySampler, fragData.texCoord);
  return texColor * fragData.color;
}
`;