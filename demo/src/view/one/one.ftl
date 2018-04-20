<#include "component/test.ftl">

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>One</title>
</head>
<body>
	<@head></@head>
  <h2>测试页面一</h2>
	<p>One Page</p>
	<#if lock??>
    <#if lock == 'true'>
      <p>今天要写文章了</p>
    <#else>
      <p>今天不写文章了</p>
    </#if>
  </#if>
	<div id="app"></div>
</body>
</html>
