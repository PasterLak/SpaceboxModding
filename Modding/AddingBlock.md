# 4. Adding Blocks

## 4.1 Texture
To add a custom block, first create a block texture and place it in the `Blocks` folder.

<span style="color:red;">**Important:**</span> Block texture names are also their IDs. They must be unique.

## 4.2 Data
Next, add the block description in `blocks.json`.

### Common Parameters:
| Parameter      | Description                             | Data Type  |
|----------------|-----------------------------------------|------------|
| **Name**       | Block name                              | Text       |
| **Mass**       | Block mass in tons                      | 0–255      |
| **Durability** | Block durability                        | 0–255      |
| **PowerToDrill** | Drill power required to mine the block | 0–255      |
| **Sides**      | Standard texture for all block sides    | Texture name |
| **Top**        | Texture for the top side                | Texture name |
| **Bottom**     | Texture for the bottom side             | Texture name |
| **IsTransparent** | Is the block transparent?             | true/false |
| **LightColor** | Makes the block a light source (RGB)    | 0–255      |
| **Category**   | Crafting table category                 | Text       |
| **SoundPlace** | Placement sound                         | Sound name |
| **SoundDestroy** | Destruction sound                     | Sound name |
| **Type**       | Block type                              | Type       |

### Block Types:
| Type           | Description                             |
|----------------|-----------------------------------------|
| **block**      | Default type for blocks without a specific type |
| **furnace**    | Furnace block                           |
| **craftingtable** | Crafting table block                 |
| **crusher**    | Crusher block                           |
| **radar**      | Radar block                             |
| **interactive** | Interactive block                      |
| **disassembler** | Disassembler block                    |
| **cable**      | Cable block                             |

## 4.3 Adding Emission
To make a block glow, place a texture in the `Emissions` folder with the same name as the block texture.  
All non-transparent pixels in this texture will glow in the dark. The color of the pixels does not matter.

[Back to Contents](Welcome.md)
