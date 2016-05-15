# Overview

This folder contains the plugins for myBase 7.x.

**Usage:**  
1. Closed the software  
2. Copy the plugin .js file to .\plugins sub folder.  
3. Run the software again.  
4. Based on the setting of the plugins, you can find the new functions from different menus.  
5. More details can be found in myBase website: [http://www.wjjsoft.com/mybase_jsapi.html#install](http://www.wjjsoft.com/mybase_jsapi.html#install)

# Plugins Provided by WJJ
## 1. Syntax highlight.js ##
The main contributor of this plugin is WJJ. This plugin supports Syntax highlight for C/C++, C/C++ with STL, Java, C#, Javascript, T-SQL, PHP, Google GO, GNU/R Language and Visual Basic, Perl, ActionScript, Delphi, Pascal, Python, BASH, Ruby, Objective-C, Swift...  
 
This function can be accessed by selecting the content and right click menu "Syntax highlight...".

## 2. Insert quick text.js ##
This plugin is provided by WJJ. You can use this plug to add pre-defined text to the HTML edit area. The pre-defined text file (txt file) can be saved under program's install folder, or the script's folder './plugins', or the current database's folder, and or the special sub folder './quicktext' under the program's folder. The file naming format should follow *.q.txt. You can access to this function from right click menu -> Insert -> Insert quick text ...

## 3. Edit with fillable form.js ##
This plugin can be used to insert and modify a list of fields [key=value] within a fillable form. You can access this function via right click menu "Edit with fillable form ...". When creating multiple 'New fields', you can use ; or , or | as separators.

## 4. Recover database.js
This plugin simply invokes the ssg5recover command-line tool to recover corrupted .nyf databases. The required ssg5recover tool is included within the SSG5 command-line package, and can be downloaded from the website: [http://wjjsoft.com/tid_ssg#recover](http://wjjsoft.com/tid_ssg#recover).

## 5. Custom table style.js
This plugin enables professional users manipulating the table style via CSS properties, the available CSS properties could be found [http://www.w3.org/TR/CSS21/propidx.html](http://www.w3.org/TR/CSS21/propidx.html)  

## 6. Open folder location.js  
This plugin can be used to open the folder location where the current shortcut file resides. You can access to this function via right-click on a 'shortcut' within the attachment pane, then select 'Open folder location' menu item.

## 7. Custom page margin.js  
This plugin is used to set margin-left/right for <body> element of the current HTML content.

## 8. custom search scope.js  
This plugin is used to run searches for words or RegExp with in a specified scope.  

## 9. Export records to CSV file.js
This plugin is created by peihaowang. It can be used to search the database/branch for a list of specified data records [key=value] and save results in a .csv file.  

# Self-developed Plugins (**Unofficial Plugin**)
>All the **Self-developed Plugins** follow [The MIT License (MIT)](http://opensource.org/licenses/MIT "MIT License") schema.
>
> **Note:**  
> - These plugins are self-developed plugins.  
> - Use these plugins **at your own risks**.  
> - Please **fully test** before using to your productive data file.   
> - Please raise a issue if you have any problems using these plugins. 
> - These plugins are tested in win7 64bit system, and myBase 7.0 beta 22 only. If you want to use in MacOS or Linux environment, please fully test.

## 1. SetFontSize.js
This plugin can be used to set the font size of current info item.  
Please note, this plugin will change all the font size of the current info item and **do not have a reverse function**, meaning you **can not use** `crtl+z` to reverse back, but you can use "Revision History" to reverse back to the previous version. Currently, the font size can be set between 5-40pt. You can find this function (**Set Font Size**) by right click in the HTML edit area.

## 2. Markdown related plugins
> **Note:** Official myBase 7.x already supports view Markdown file attachment directly and edit .md file.
>
> **Dependency:** The below two markdown related plugins use the interface provided by **marked.js**. To run these two plugins, you need first to download the **marked.js** from the project page: [https://github.com/chjj/marked](https://github.com/chjj/marked) and put to myBase \plugins folder.

### 2.1 Markdown2html.js
This Plugin can change the markdown syntax contents in info item to HTML. You can access to this function by selecting the contents and by right click menu -> Text Utilities -> mdText2html

### 2.2 Markdownattach.js
This Plugin can display the .md attachment in the HTML info item. You can access to this function by right click the .md attachment menu -> .mdatt2InfoItem. 

## 3. WordCount.js
This plugin can be used to calculate the word count of the selected contents of the info item. You can access to this function by selecting the content and via right click menu -> Text Utilities -> Word Count.

## 4. Calculate.js
> **Dependency:** This plugin uses the interface provided by **math.js**. To run this plugin, you need first to download the **math.js** from the project page: [https://github.com/josdejong/mathjs](https://github.com/josdejong/mathjs) and put to myBase \plugins folder together with Calculate.js.
 
To access this function, you can highlight any math expression from the info item area and right click menu -> Text Utilities -> Calculate.  

**Example math expression:** `cos(20.9 deg) * 0.9342 / (3+9) * (2.3+5.87) / 11`  

## 5. Save2QuickText.js
This plugin can be used to save selected text to Quick text (*.q.txt) file and normal text (txt) file. You can access to this function by selecting the content and via right click menu -> Text Utilities -> Save to Quick Text.

## 6. SetBackgroundColor.js
This plugin can be used to set the background color of the infoItem.

## 7. SetBackgroundImg.js
This plugin can be used to set the background image of the infoItem. (**Need to put the desired image file in the attachment of info item first**)
