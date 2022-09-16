# Vaping Regulations Shared Components
This repository consists of the __Shared Components__ module for the vaping regulation project.
The shared components module includes the shared typedefs repo as a dependency, and re-exports them from it's index.ts file. The shared typedef module however can be installed as a standalone for use within an API.

## Component Repository Configuration

#### Creating components
All shared components should be created in the ./src/components folder. New subfolders may be created for organization of components as needed.
Components should be self-contained, with all of their default styling contained within the component file itself, and preferably handled through MUI makeStyles/createStyles.

#### Accessing components
Components should be imported / re-exported through **./src/index.ts** to be made easily available in projects that include this package, as well
as for easy access when testing.

#### Path aliasing
Currently paths have been aliased from **<rootDir>/src/** to **'@/'**. Between this and re-exporting through index.ts, all components can be included
into other files, such as test files through the syntax **import { ComponentName } from '@/index'**

#### Git settings
To simulate an NPM published package, the dist folder needs to be committed to the repo and cannot be gitignored. Additionally, any time there is a change to the app source, the build process will need to be run before commit.

## Testing

#### Test runner and testing library
This repository uses Jest as the test runner and a library called [react-testing-library](https://testing-library.com/docs/react-testing-library/intro) for testing react components. It also integrates Jest-Junit for xml generation.

#### Writing tests
Each component or hook should have a corresponding test file located at **./src/\__tests__/unit/components/**. Additional subfolders can be created as needed, but the hierarchy should match what is found in the src/components folder.

#### Running tests
Tests can be executed by running **npm/yarn run test**. This will execute all tests found under the \__tests__ folder, and generate a coverage report that can be found under **./coverage**. The coverage report will exclude all paths specified in the jest.config.js file.


## DOM Rendering

#### Creating stories
This repository implements [Storybook](https://storybook.js.org/) for isolated component redering. This allows viewing of components without needing to pass the component through the standard React build/run process, and allows them to be vetted for errors before being commited to the repo.
Each component should have it's own story file, and should be created under **./src/stories**. Additional subfolders can be created as needed, but the hierarchy should match what is found in the src/components folder.
**IMPORTANT** Due to Storybook being passed through webpack, components must be imported from 'index.ts' through _absolute paths only_.

#### Viewing stories
To view stories created for components, run the command **npm/yarn run storybook** to generate a webpage where each component can be viewed.

## Publishing changes

To commit all changes to the bitbucket repository, run **make prepare-push** from the root directory. This will automatically clean up old dist files and run **npm run build** for both the parent module and the submodule. This step needs to be done for changes to become available to the repo's consumers, as only the dist folder is installed.


## TODO
- specify process for integration with pipelines (not this project integrating with pipelines, rather the project **__importing__** this project.)
- modify linter and prettier config to be in line with front end app
