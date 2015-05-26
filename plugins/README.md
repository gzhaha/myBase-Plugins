# Plugins

This folder contains all the plugins (**NOT OFFICIAL PLUGINS**) for myBase 7.x.

> Note: These plugins are tested in win7 64bit system, and myBase 7.0 beta 19.
 
**Usage:**  
1. Closed the software  
2. Copy the plugin .js file to \plugins folder.  
3. Run the software again.  
4. Based on the setting of the plugins, you can find the new functions from different menu.

# Plugins Lists
## 1. SetFontSize.js 
This plugin can be used to set the font size of current info item.  
Please note, this plugin will change all the font size of the current info item and **do not have a reverse function**, meaning you **cannot use** `crtl+z` to reverse back. Currently, the font size can be set between 5-40pt. You can find this function (**Set Font Size**) by right click in the input area.

## 2. Markdown related plugins
The below two markdown related plugins use the interface privided by **marked.js**. To run these two plugins, you need to first download the **marked.js**  from project page: [https://github.com/chjj/marked](https://github.com/chjj/marked) and put to myBase \plugins folder.

### 2.1 Markdown2html.js
This Plugin can change the markdown syntax contents in info item to html. You can access to this function by selecting the contents and by right click menu -> Text Utilities -> md2html

### 2.2 markdownattach.js
This Plugin can change the .md attachment to html info item. You can access to this function by right click the .md attachment menu -> .mdatt2InfoItem. Please note running this plugin **will replace all the original content** and it **do not** privide `crtl+z` function to reverse back.

## 3. WordCount.js ##
This plugin can be used to calculate the word count of the selected contents in the info item. You can access to this function by selecting the content and via right click menu -> Text Utilities -> Word Count.