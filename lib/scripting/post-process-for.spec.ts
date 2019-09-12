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

import { expect } from 'chai';
import { vbsToJs } from '../../test/script.helper';

describe('The VBScript transpiler - For', () => {
	it('should transpile a "For...Next" statement', () => {
		const vbs = `For j = 1 To 20\ntotal = total + 1\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (j = 1; j <= 20; j += 1) {\n    total = total + 1;\n}');
	});

	it('should transpile a "For/Step...Next" statement', () => {
		const vbs = `For j = 1 To 20 Step 3\ntotal = total + 1\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (j = 1; 3 < 0 ? j >= 20 : j <= 20; j += 3) {\n    total = total + 1;\n}');
	});

	it('should transpile a "For/Each...Next" statement', () => {
		const vbs = `For Each x In students\ntotal = total + x\nNext\n`;
		const js = vbsToJs(vbs);
		expect(js).to.equal('for (x of students) {\n    total = total + x;\n}');
	});
});