import { BuildExecutorSchema } from "./schema"
import { ExecutorContext } from "nx/src/config/misc-interfaces"
import { executeCommand } from "../../utils/exec"
import { FsTree } from "nx/src/generators/tree"
import { getUnityBinaryPath } from "../../utils/platform"
import { workspaceRoot } from "nx/src/utils/workspace-root"
import { copySync } from "fs-extra"
import { output } from "@nx/devkit"
import { posixJoin } from "../../utils/posix"
import * as path from "path"

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {
    // Get the Unity version from the ProjectVersion.txt
    const projectPath = posixJoin(context.root, context.workspace.projects[context.projectName].root)
    const tree = new FsTree(projectPath, context.isVerbose)
    const versionFileContent = tree
        .read(posixJoin("ProjectSettings", "ProjectVersion.txt"))
        .toString()
    const version = versionFileContent.split("\n")[0].split(" ")[1]

    // Copy the project to a temporary directory
    const tempProjectPath = posixJoin(workspaceRoot, "tmp", context.projectName)
    const filter = (file) => {
        return !file.startsWith(path.join(projectPath, "Temp/"))
    }
    output.log({ title: "Copying project to temporary directory", bodyLines: [tempProjectPath] })
    copySync(projectPath, tempProjectPath, { filter })

    // Build the project using the Unity CLI
    const unityBinaryPath = getUnityBinaryPath(version)
    const command = `"${unityBinaryPath}" -quit -batchmode -nographics -logFile - -executeMethod ${options.executeMethod} -projectPath "${tempProjectPath}"`
    await executeCommand(command)

    return { success: true }
}
