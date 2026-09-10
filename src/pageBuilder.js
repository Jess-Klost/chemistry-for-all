var testContent = '<!DOCTYPE html><html lang="en"><head><title>Example Webpage</title></head><body></body></html>';
var cylinderContent = '<h1>Cylinder</h1><input type="button" id="back" value="Back" onclick="replaceElement(\'body\', oldContent, \'cylinderButton\')" /><p>The cylinder can hold 25 ml.</p><input type="button" value="Move to Sink"></html>';
var oldContent = ''; // stores the last page for back buttons

function replaceContent(newContent) {
    // must re-add doctype, since outerHTML does not include it
    oldContent = '<!DOCTYPE html>' + document.documentElement.outerHTML;
    document.open();
    document.write(newContent);
    document.close();
}

function replaceElement(id, newContent, elementToFocus = '') {
    oldContent = document.getElementById(id).innerHTML;
    document.getElementById(id).innerHTML = newContent;
    if (elementToFocus != '')
        focusElement(elementToFocus);
}

function focusElement(id) {
    document.getElementById(id).focus();
}