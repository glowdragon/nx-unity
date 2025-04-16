import { getWorkspaceLayout, Tree } from "@nx/devkit"
import { executeCommand } from "./exec"
import { getUnityBinaryRelativePath } from "./platform"
import { posixJoin } from "./posix"

/**
 * Creates a new Unity project from scratch by running the Unity CLI with the -createProject flag.
 */
async function createUnityProject(
    unityBasePath: string,
    unityVersion: string,
    projectRoot: string
) {
    const unityBinaryPath = posixJoin(unityBasePath, unityVersion, getUnityBinaryRelativePath())
    const command = `"${unityBinaryPath}" -quit -batchmode -nographics -logFile - -createProject ${projectRoot}`
    await executeCommand(command)
}

function addWorkspacePackageToUnityProject(
    tree: Tree,
    projectName: string,
    packageName: string
): boolean {
    const workspaceLayout = getWorkspaceLayout(tree)
    return addDependencyToUnityProject(
        tree,
        projectName,
        packageName,
        "file:" + posixJoin("..", "..", "..", workspaceLayout.libsDir, packageName)
    )
}

/**
 * Adds a dependency to a Unity project.
 * @returns true if the dependency was added, false if it was already present
 */
function addDependencyToUnityProject(
    tree: Tree,
    projectName: string,
    dependencyKey: string,
    dependencyValue: string
): boolean {
    const workspaceLayout = getWorkspaceLayout(tree)
    const manifestPath = posixJoin(workspaceLayout.appsDir, projectName, "Packages", "manifest.json")
    const manifest = JSON.parse(tree.read(manifestPath).toString())
    const dependencies = manifest.dependencies
    if (!dependencies[dependencyKey]) {
        dependencies[dependencyKey] = dependencyValue
        tree.write(manifestPath, JSON.stringify(manifest, null, 2))
        return true
    }
    return false
}

export { createUnityProject, addWorkspacePackageToUnityProject, addDependencyToUnityProject }
