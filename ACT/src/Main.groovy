static void main(String[] args) {
  def rootDir = new File(getClass().protectionDomain.codeSource.location.path).parentFile.parentFile
  def exeFile = new File(rootDir, "OZHTMLViewer.exe")
  def emptyOzFile = new File(rootDir, "empty.oz")
  def exportPath = new File(rootDir, "export")
  def ozdFile = new File(rootDir, "test.ozd")
  def token = ";"
  if (!exeFile.exists()) {
    println "exe file does not exist!"
    println exeFile.absolutePath
    return
  }
  if (!emptyOzFile.exists()) {
    println "empty.oz does not exist!"
    return
  }
  if (!ozdFile.exists()) {
    println "ozd file does not exist!"
    return
  }
  if (exportPath.exists()) {
    exportPath.deleteDir()
  }
  exportPath.mkdirs()

  def params = [
          "viewer.useprogressbar=false",
          "viewer.showerrormessage=false",
          "viewer.errorcommand=true",
          "viewer.progresscommand=true",
          "export.mode=silent",
          "export.savemultidoc=true",
          "export.confirmsave=false",
          "export.executefile=false",
          "information.debug=true",
          "repository_agent.try_license_count_check=true",
          "export.format=pdf,png,svg",
          "connection.openfile=" + ozdFile.absolutePath
  ]

  def command = [
          exeFile.absolutePath,
          "--file", emptyOzFile.absolutePath,
          "--string", params.join(token),
          "--token", token,
          "--exportpath", exportPath.absolutePath
  ]

  def process = command.execute()
  process.waitFor()

  println "opening the export directory in explorer (${exportPath}) ..."
  try {
    if (System.properties['os.name'].toLowerCase().contains('windows')) {
      ["explorer", exportPath.absolutePath].execute()
    } else {
      println "could not open the export directory...${System.properties['os.name']}"
    }
  } catch (Exception e) {
    println "error on opening the export directory: ${e.message}"
  }
}