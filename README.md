# Nx Unity

This repository contains an Nx plugin for integrating Unity projects into Nx workspaces.

## Nx Plugin

Location: `packages/nx-unity`

This plugin allows you to seamlessly integrate Unity projects into your Nx workspace. It provides custom executors and generators to streamline your Unity development workflow within the Nx ecosystem.

## Getting Started

Install the Nx plugin in your Nx workspace:

```shell
npm install --save-dev nx-unity
```

### New Project

If you want to start a new Unity project, generate one with the following command:

```shell
npx nx generate nx-unity:project
```

That's it! You can now open the generated Unity project in Unity Hub and start developing.

### Existing Project

Integrating Nx into an existing Unity project is also possible, but requires manual setup.

1. Create a `project.json` file in the root of your Unity project. Below is a minimal example with a build target for Windows:

```json
{
  "name": "client",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/<projectName>/Assets",
  "targets": {
    "build": {
      "executor": "nx-unity:build",
      "configurations": {
        "windows": {
          "executeMethod": "BuildCommands.BuildWindows"
        }
      },
      "defaultConfiguration": "windows"
    }
  }
}
```

## Support

Encountered an issue or have suggestions for improvements?
Feel free to [raise an issue](https://github.com/danielkreitsch/nx-unity/issues/new).

Contributions are welcome!
