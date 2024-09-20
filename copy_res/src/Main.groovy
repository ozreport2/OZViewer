import java.nio.file.Files
import java.nio.file.StandardCopyOption

static void copyTestRes(String ozsourcePath) {
  println("<--- MODE : Copy test html")

  File destDir = new File(ozsourcePath + "/OZReportViewer/OZJSViewer/bin")
  File srcDir = new File("res")
  println "src : ${srcDir.getAbsolutePath()}"
  println "dest : ${destDir.getAbsolutePath()}"
  srcDir.listFiles().each { f ->
    File dest = new File(destDir, f.name)
    println "copy : ${f.absolutePath} ==> ${dest.absolutePath}"
    Files.copy(f.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING)
  }

  println("copy resource ...")

  ProcessBuilder pb = new ProcessBuilder("cmd", "/c", "resource_copy.bat")
  pb.directory(new File(ozsourcePath + "/OZReportViewer/OZJSViewer"))
  Process process = pb.start()

  BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))
  String line

  while ((line = reader.readLine()) != null) {
    println line
  }

  // 프로세스가 종료될 때까지 기다립니다.
  int exitCode = process.waitFor()
  assert exitCode == 0
}

static void copyDevTestRes(String ozsourcePath) {
  println("<--- MODE : Copy dev-test resources")

  File srcDir = new File(ozsourcePath + "/OZReportViewer/OZJSViewer/bin/res")
  File destDir = new File("../dev_test/viewer/res")
  println "src : ${srcDir.getAbsolutePath()}"
  println "dest : ${destDir.getAbsolutePath()}"
  srcDir.listFiles().each { f ->
    if (f.name.endsWith(".js")) {
      File dest = new File(destDir, f.name)
      println "copy : ${f.absolutePath} ==> ${dest.absolutePath}"
      Files.copy(f.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING)
    }
  }
}

static void main(String[] args) {
  print "arg :"
  for(arg in args) {
    print " ${arg}"
  }
  println()

  String ozsourcePath = args[0]
  String modeName = null
  if (args.length > 1) {
    modeName = args[1];
  }
  if (modeName != null) {
    switch (modeName) {
      case "devTestRes":
        copyDevTestRes(ozsourcePath)
        return
    }
  }
  copyTestRes(ozsourcePath)
}