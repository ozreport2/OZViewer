import java.nio.file.Files
import java.nio.file.StandardCopyOption

static void main(String[] args) {
  print "arg :"
  for(arg in args) {
    print " ${arg}"
  }
  println()

  println("copy test html ...")

  File destDir = new File(args[0] + "/OZReportViewer/OZJSViewer/bin")
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
  pb.directory(new File(args[0] + "/OZReportViewer/OZJSViewer"))
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