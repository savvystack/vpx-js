/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import * as chai from 'chai';
import { expect } from 'chai';
import { getTextFile } from '../vbs-scripts.node';
import { Grammar } from './grammar';

chai.use(require('sinon-chai'));

let grammar: Grammar;

before(async () => {
	grammar = new Grammar();
});

describe('The scripting grammar - format', () => {
	it('should remove whitespace', () => {
		const vbs = `Dim   x`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Dim x\n`);
	});

	it('should remove comments', () => {
		const vbs = `Dim   x ' Test comment`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Dim x\n`);
	});

	it('should standardize keywords', () => {
		const vbs = `ReDiM x(2) : DiM x2`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`ReDim x(2):Dim x2\n`);
	});

	it('should join line continuation', () => {
		const vbs = `x = x +_\n5`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`x=x+5\n`);
	});

	it('should remove blank lines', () => {
		const vbs = `x = x + 5\n\n\nx = x + 10\n\n\n`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`x=x+5\nx=x+10\n`);
	});
});

describe('The scripting grammar - transpile', () => {
	it('should throw an exception for an empty script', () => {
		const vbs = ``;
		expect(() => grammar.transpile(vbs)).to.throw(Error);
	});

	it('should throw an exception for invalid syntax', () => {
		const vbs = `test()\ntest2\ntest3() 1,2\n`;
		expect(() => grammar.transpile(vbs)).to.throw(Error);
	});

	it('should allow lines to end with a ":" statement terminator', () => {
		const vbs = `SLLPos=0:Me.TimerEnabled=1:\n`;
		const js = grammar.vbsToJs(vbs);
		expect(js).to.equal(`SLLPos = 0;\nthis.TimerEnabled = 1;`);
	});

	// it('should transpile controller.vbs successfully', () => {
	// 	const vbs = getTextFile('controller.vbs');
	// 	expect(() => grammar.transpile(vbs)).not.to.throw(Error);
	// });
	//
	// it('should transpile core.vbs successfully', () => {
	// 	const vbs = getTextFile('core.vbs');
	// 	expect(() => grammar.transpile(vbs)).not.to.throw(Error);
	// });
});

describe('The scripting grammar - VBA features', () => {
	it('should accept escaped identifier', () => {
		const vbs = `Dim [to],[next],[item],record : [to] = 12 : [next] = 13\n`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Dim [to],[next],[item],record:[to]=12:[next]=13\n`);
	})

	it('should accept Option Compare statement', () => {
		const vbs = `Option Compare Database`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Option Compare Database\n`);
	})

	it('should accept more than one Option statements', () => {
		const vbs = `Option Compare Database: Option Explicit`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Option Compare Database:Option Explicit\n`);
	})

	it('shoule allow Dim...As... construct', () => {
		const vbs = `Dim a as String, b,c as Integer, d as Date, e as MyClass.Subclass`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Dim a As String,b,c As Integer,d As Date,e As MyClass.Subclass\n`);
	})

	it('should accept argument list enclosed in parentheses', () => {
		const vbs2 = `call MyFunc x, y, z`;
		const js2 = grammar.format(vbs2);
		expect(js2).to.equal(`Call MyFunc x,y,z\n`);

		const vbs = `call MyFunc(x, y, z)`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Call MyFunc(x,y,z)\n`);
	})

	it('should allow omitted argments in argument list', () => {
		const vbs = `call MyFunc , , z`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Call MyFunc,,z\n`);
	})

	it('should accept files begin with a prolog section', () => {
		const vbs = `
VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "Form_frmAddScopeRec"
Attribute VB_GlobalNameSpace = False
`
		const js = grammar.format(vbs);
		expect(js).to.equal(`VERSION 1.0 Class\nBEGIN\nMultiUse=-1\nEnd\nAttribute VB_Name="Form_frmAddScopeRec"\nAttribute VB_GlobalNameSpace=False\n`);
	})

	it('should accecpt type character in identifier', () => {
		const vbs = `Dim a$, j#, for$\n`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Dim a$,j#,for$\n`);
	})

	it('should accept type declaration in function paramerters', () => {
		const vbs = `Function x(a as Integer, b as String): return a: End Function`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Function x(a As Integer,b As String):return a:End Function\n`);
	})

	it('should accept type declaration in function signature', () => {
		const vbs = `Function x(a as Integer, b as String) as Integer: return a: End Function`;
		const js = grammar.format(vbs);
		expect(js).to.equal(`Function x(a As Integer,b As String) As Integer:return a:End Function\n`);
	})

	it('should accept "" as escaped dobule-quote', () => {
		const vbs = `s = "he said ""this should work"""`
		const js = grammar.format(vbs);
		expect(js).to.equal(`s="he said ""this should work"""\n`);
	})

	it('should accept & for string concatenation', () => {
		const vbs = `s = "s1" & x & "s2"`
		const js = grammar.format(vbs);
		expect(js).to.equal(`s="s1"&x&"s2"\n`);
	})

	it('should accept ! for dictionary access on object', () => {
		const vbs = `s = obj!key`
		const js = grammar.format(vbs);
		expect(js).to.equal(`s=obj!key\n`);
	})

	// it('should accept Option Explicit with argument', () => {
	// 	const vbs = `Option Explicit on`;
	// 	const js = grammar.format(vbs);
	// 	expect(js).to.equal(`Option Explicit On\n`);
	// })

	// it('should not accept Option Compare without argument', () => {
	// 	const vbs = `Option Compare`;
	// 	const js = grammar.format(vbs);
	// 	expect(js).to.equal(`Option Compare\n`);
	// })

});

