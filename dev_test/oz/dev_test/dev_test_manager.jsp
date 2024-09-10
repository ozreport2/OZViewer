<%@page contentType="text/plain;charset=UTF-8"%>
<%request.setCharacterEncoding("UTF-8");response.setContentType("text/plain;charset=UTF-8");%>
<%@ page import = "java.io.File,
		java.util.Hashtable,
		java.io.*,
		java.util.*,
		java.lang.Math
		"
%>
<%!
	private static String s_DevTestViewerVersion = "80.2020.0722.200";

	private static String s_ROOT_PATH = "";
	private static Boolean IsEmpty(String strValue) {
		if (strValue != null && strValue.length() > 0) {
			return false;
		} else {
			return true;
		}
	}
	private static String GetParamValue(String strValue) {
		if (strValue == null) {
			return "";
		} else {
			return strValue;
		}
	}
	private static int GetParamValue_Int(String strValue) {
		int nValue = -1;
		try {
			if (!IsEmpty(strValue)) {
				nValue = (int) Math.floor(Double.parseDouble(strValue));
			}
		} catch (Exception e) {
		}
		return nValue;
	}
	private static ArrayList<String> GetDirectories(String strValue) {
		String strPath = s_ROOT_PATH + strValue;
		ArrayList<String> strList = new ArrayList<String>();
		File file = new File(strPath);
        try {
            System.err.println(file.getCanonicalPath());
            } catch (IOException e) {
            e.printStackTrace();
            }
		if (file != null) {
			File[] fileList = file.listFiles();
			if (fileList != null) {
				for (File f : fileList) {
					if (f.isDirectory()) {
						strList.add(f.getName());
					}
				}
			}
		}
		return strList;
	}
	private static ArrayList<String> GetFiles(String strValue) {
		String strPath = s_ROOT_PATH + strValue;
		ArrayList<String> strList = new ArrayList<String>();
		File file = new File(strPath);
		if (file != null) {
			File[] fileList = file.listFiles();
			if (fileList != null) {
				for (File f : fileList) {
					if (f.isFile()) {
						strList.add(f.getName());
					}
				}
			}
		}
		return strList;
	}
	private static String GetParameters(String strValue, String strSep, Boolean bOrigin) {
		String strPath = s_ROOT_PATH + strValue;
		StringBuilder sb = new StringBuilder();
		File file = new File(strPath);
		if (file.exists()) {
			BufferedReader br = null;
			try {
				br = new BufferedReader(new FileReader(file));
				String strLine = null;
				while ((strLine = br.readLine()) != null) {
					if (bOrigin|| !IsEmpty(strLine) && strLine.charAt(0) != '#' && strLine.charAt(0) != '/') {
						sb.append(strLine);
						sb.append(strSep);
					}
				}
			} catch (FileNotFoundException e) {
			} catch (IOException e) {
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
					}
				}
			}
		}
		return sb.toString();
	}
	private static String GetFileString(String strValue, int nLineCount) {
		String strPath = s_ROOT_PATH + strValue;
		StringBuilder sb = new StringBuilder();
		File file = new File(strPath);
		if (file.exists()) {
			BufferedReader br = null;
			try {
				br = new BufferedReader(new FileReader(file));
				ArrayList<String> strList = new ArrayList<String>();
				String strLine = null;
				while ((strLine = br.readLine()) != null) {
					strList.add(strLine);
				}
				int nStartLine = 0;
				int nTotalLineCount = strList.size();
				if (nLineCount < nTotalLineCount) {
					nStartLine = nTotalLineCount - 1 - nLineCount;
				}
				for (int i = nStartLine; i < nTotalLineCount; i++) {
					sb.append(strList.get(i));
					if (i < nTotalLineCount - 1) {
						sb.append("\n");
					}
				}
			} catch (FileNotFoundException e) {
			} catch (IOException e) {
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
					}
				}
			}
		}
		return sb.toString();
	}

%>
<%
	if (IsEmpty(s_ROOT_PATH)) {
		String strPath = new File(request.getRealPath("") + "../../").getCanonicalPath() + "/";
		s_ROOT_PATH = strPath.replaceAll("\\\\", "/");
	}
    System.out.println("JSP 실제 파일 경로: " + s_ROOT_PATH);
	String strDirectory = GetParamValue(request.getParameter("directories"));
	String strSep = GetParamValue(request.getParameter("sep"));
	String strScenarioID = GetParamValue(request.getParameter("scenario_id"));
	String strParamFile = GetParamValue(request.getParameter("param_file"));
	String strParamOriginFile = GetParamValue(request.getParameter("param_origin_file"));
	String strParamViewerVersion = GetParamValue(request.getParameter("viewerversion"));
	String strLogs = GetParamValue(request.getParameter("serverlogs"));
	int nLineCount = GetParamValue_Int(request.getParameter("showline"));
	
	ArrayList<String> strList = null;
	//if (IsEmpty(strSep)) {
	//	strSep = ",";
	//}
	
	String strResult = "";
	String strPath = "";
	boolean skip = false;
	if("scenario".equals(strDirectory)) {
		skip = true;
	} else if("user".equals(strDirectory)) {
		strDirectory = "param";
	}

    System.err.println("strDirectory : " + strDirectory);

	if(!skip) {
        if (!IsEmpty(strParamViewerVersion)) {
            strResult = s_DevTestViewerVersion;

        } else if (!IsEmpty(strParamFile)) {
            strPath = strDirectory + "/" + strScenarioID + "/" + strParamFile;
            Boolean bOrigin = false;
            if (strParamOriginFile.equals("true")) {
                bOrigin = true;
            }
            strResult = GetParameters(strPath, strSep, bOrigin);

        } else if (!IsEmpty(strLogs)) {
            strPath = "WEB-INF/logs/server.log";
            nLineCount = Math.max(nLineCount, 100);
            nLineCount = Math.min(nLineCount, 1000);
            strResult = GetFileString(strPath, nLineCount);

        } else {
            if (!IsEmpty(strScenarioID)) {
                strPath = strDirectory + "/" + strScenarioID;
                strList = GetFiles(strPath);
            } else {
                strPath = strDirectory;
                strList = GetDirectories(strPath);
            }
            int nLength = strList.size();
            if (nLength > 0) {
                Collections.sort(strList);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < nLength; i++) {
                    String strValue = strList.get(i);
                    sb.append(strValue);
                    if (i < nLength - 1) {
                        sb.append(strSep);
                    }
                }
                strResult = sb.toString();
            }
        }
	}
	response.setHeader("X-dev_test", "20201028");
	response.setHeader("Cache-Control", "no-store"); 
	response.setHeader("Pragma", "no-cache"); 
	response.setDateHeader("Expires", 0);
	response.setHeader("Set-Cookie", "SameSite=None;Secure;");
	out.clearBuffer();
	out.print(strResult);
%>