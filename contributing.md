# Contributing

Hiya! If you want to help me develop GPGP, here's a quick rundown of what the HECk is going on with this project. Feel free to ask me questions about anything that doesn't make sense.

## How you're meant to use GPGP

### Step 1 - create a new project
A project file in GPGP contains the settings for your levels, such as tile size and default level size. It also contains a list of tilesets and entities. Multiple levels can be based on the same project, so it makes sense to have one project file for each game you're working on, and one level file for each level in that game.

### Step 2 - create a level
Once the project is saved, you can create a new level based on that project. Each level can have any number of layers of different types:
- Geometry layers: good for defining where the level has collisions
- Tile layers: good for decorating the level
	- Each tile layer is associated with a specific tileset defined in the project file
- Entity layers: good for adding objects to the level, like players, enemies, pickups, etc.
	- Each entity has customizable parameters (defined in the project editor) - good for things like speed, IDs, etc.

## Libraries used
- **typescript** for strong typing; most important for data interfaces
- **webpack** for bundling everything in `src` into `dist/main.js`, which electron loads
- **electron** for loading web pages as a desktop app - provides menu bars, access to node APIs, etc.
- **react** for rendering and architecture
- **reactstrap** for using bootstrap controls as react components
- **jimp** for loading images from the filesystem and getting size and data URIs for `<img>` tags

## Basic code structure
- `main.js` - basic electron setup/configuration
- `src/index.tsx` - main entry point into the app
- `app.tsx` - main screen of the app, holds project editor and level editor tabs
- `src/data/` - the data types used by GPGP and functions for working with them
- `src/ui/`
	- `/grid.tsx` - an interactive grid used in multiple places
	- `/cursor/` - cursor components to show what you're going to place/remove from a level
	- `/project-editor/` - forms for creating/editing projects
	- `/level-editor/`
		- `/layer/` - renders the layers of a level
		- `/sidebar/` - the sections in the sidebar (layer list, tile picker, etc.)

## Data flow
- `app.tsx` - holds project editor and level editor tabs. Also facilitates passing project data to and from the project editor and level editor, but doesn't hold onto any project/level data permanently
- `project-editor.tsx` - optionally receives project data (if opening an existing project) or creates a new blank project. also holds project resources in the state (for now just tileset images)
- `level-editor.tsx` - receives project data and optionally receives level data. also loads its own copy of the project resources
- `grid.tsx` - meant to be a reusable interactive grid, so only receives the bare minimum data, like tile size, width, and height. has callbacks for cursor movement, mouse click/release, etc.

## Todo
- [ ] Add entity layers and entity configuration in project
	- I'm envisioning the project editor as having an entities tab where you can define a variety of entities, each with a visual representation, size, etc. You can also set parameters of different types - for instance, an enemy might have a jump height parameter, walk speed parameter etc.
	- In the level editor, you could create entity layers where you place entities and customize the parameters for each instance
- [ ] More editing tools
	- Right now I have a pencil tool (working well) and a rectangle tool (mostly there). Ideas for other tools:
		- Select
		- Move
		- Fill
		- 9patch
- [ ] Dark theme/custom window frame - it's all the rage !
- [ ] More customization for tilesets
	- Some tileset images have weird padding, spacing between tiles, etc., so that should probably be supported
- [ ] Allow non-square tiles - I've never needed that but maybe some people will?
