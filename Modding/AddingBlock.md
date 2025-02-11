# 4. Adding Blocks

## 4.1 Texture
<img src="/Images/display.png" alt="Display" width="200" height="200">

To add a custom block, first create a block texture and place it in the `Blocks` folder.

<span style="color:red;">**Important:**</span> Block texture names are also their IDs. They must be unique.

## 4.2 Data
Next, add the block description in `blocks.json`.

### Common Parameters:
<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Description</th>
      <th>Data Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Name</strong></td>
      <td>Block name</td>
      <td>Text</td>
    </tr>
    <tr>
      <td><strong>Mass</strong></td>
      <td>Block mass in tons</td>
      <td>0–255</td>
    </tr>
    <tr>
      <td><strong>Durability</strong></td>
      <td>Block durability</td>
      <td>0–255</td>
    </tr>
    <tr>
      <td><strong>PowerToDrill</strong></td>
      <td>Drill power required to mine the block</td>
      <td>0–255</td>
    </tr>
    <tr>
      <td><strong>Sides</strong></td>
      <td>Standard texture for all block sides</td>
      <td>Texture name</td>
    </tr>
    <tr>
      <td><strong>Top</strong></td>
      <td>Texture for the top side</td>
      <td>Texture name</td>
    </tr>
    <tr>
      <td><strong>Bottom</strong></td>
      <td>Texture for the bottom side</td>
      <td>Texture name</td>
    </tr>
    <tr>
      <td><strong>IsTransparent</strong></td>
      <td>Is the block transparent?</td>
      <td>true/false</td>
    </tr>
    <tr>
      <td><strong>LightColor</strong></td>
      <td>Makes the block a light source (RGB)</td>
      <td>0–255</td>
    </tr>
    <tr>
      <td><strong>Category</strong></td>
      <td>Crafting table category</td>
      <td>Text</td>
    </tr>
    <tr>
      <td><strong>SoundPlace</strong></td>
      <td>Placement sound</td>
      <td>Sound name</td>
    </tr>
    <tr>
      <td><strong>SoundDestroy</strong></td>
      <td>Destruction sound</td>
      <td>Sound name</td>
    </tr>
    <tr>
      <td><strong>Type</strong></td>
      <td>Block type</td>
      <td>Type</td>
    </tr>
  </tbody>
</table>

### Block Types:
<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>block</strong></td>
      <td>Default type for blocks without a specific type</td>
    </tr>
    <tr>
      <td><strong>furnace</strong></td>
      <td>Furnace block</td>
    </tr>
    <tr>
      <td><strong>craftingtable</strong></td>
      <td>Crafting table block</td>
    </tr>
    <tr>
      <td><strong>crusher</strong></td>
      <td>Crusher block</td>
    </tr>
    <tr>
      <td><strong>radar</strong></td>
      <td>Radar block</td>
    </tr>
    <tr>
      <td><strong>interactive</strong></td>
      <td>Interactive block</td>
    </tr>
    <tr>
      <td><strong>disassembler</strong></td>
      <td>Disassembler block</td>
    </tr>
    <tr>
      <td><strong>cable</strong></td>
      <td>Cable block</td>
    </tr>
  </tbody>
</table>

## 4.3 Adding Emission
To make a block glow, place a texture in the `Emissions` folder with the same name as the block texture.  
All non-transparent pixels in this texture will glow in the dark. The color of the pixels does not matter.

[Back to Home](../README.md)
