This is **NOT** the Visual Pinball simulator. For the original `vpx-js` project, check here: https://github.com/vpdb/vpx-js.git

# Visual Basic for Application (VBA) to TypeScript Transcoder and Runtime Environment

This is an experimental at the moment. I'll break out the forked repo and start a new one later.

All new code/changes will live under `vba-*` branches.

## Objectives

* Transcode VBA code to production quality TypeScript code
* Extract/derive type information from VBA code
* Maintain accurate reference to the original VBA code in generated code for troubleshooting
* Ultimately, be able to run Microsoft Access code unmodified in the browser

## Credits

* @freezy for writting the VBScript to JavaScript transcoder
* @jsm174 for getting the Nearley grammar right and his work on translating VBScript to JavaScript
* @neophob for his awesome WPC-EMU integration

## License

GPLv2, see [LICENSE](LICENSE).

