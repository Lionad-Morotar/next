{"meta":"","api":"<h2 id=\"API\">API <a class=\"header-anchor scroll-count-item\" href=\"#API\" data-scroll-id=\"API\">#</a></h2>\n<h3 id=\"Icon\">Icon <a class=\"header-anchor scroll-count-item\" href=\"#Icon\" data-scroll-id=\"Icon\">#</a></h3>\n<table>\n<thead>\n<tr>\n<th>Param</th>\n<th>Descripiton</th>\n<th>Type</th>\n<th>Default Value</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>size</td>\n<td>To set the icon size<br><br><strong>option</strong>:<br>'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'inherit'</td>\n<td>Enum</td>\n<td>'medium'</td>\n</tr>\n<tr>\n<td>type</td>\n<td>Specify which icon to display</td>\n<td>String</td>\n<td>-</td>\n</tr>\n</tbody>\n</table>\n<!-- api-extra-start -->\n<h3 id=\"Icon Create From Iconfont CN\">Icon.createFromIconfontCN <a class=\"header-anchor scroll-count-item\" href=\"#Icon Create From Iconfont CN\" data-scroll-id=\"Icon Create From Iconfont CN\">#</a></h3>\n<p>If you want to use svg icon, use <code>Icon.createFromIconfontCN</code>.</p>\n<pre class=\"language-js\"><code class=\"language-js\"><span class=\"token keyword\">import</span> <span class=\"token punctuation\">{</span> Icon <span class=\"token punctuation\">}</span> <span class=\"token keyword\">from</span> <span class=\"token string\">'@alifd/next'</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token keyword\">const</span> CustomIcon <span class=\"token operator\">=</span> Icon<span class=\"token punctuation\">.</span><span class=\"token function\">createFromIconfontCN</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">{</span>\n    scriptUrl<span class=\"token operator\">:</span> <span class=\"token string\">'//at.alicdn.com/t/font_1464085_egnk4s8yv2f.js'</span><span class=\"token punctuation\">,</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n\n<span class=\"token comment\">// CustomIcon have the same props as Icon, e.g. size</span>\nReactDOM<span class=\"token punctuation\">.</span><span class=\"token function\">render</span><span class=\"token punctuation\">(</span>\n    <span class=\"token operator\">&lt;</span>div<span class=\"token operator\">&gt;</span>\n        <span class=\"token operator\">&lt;</span>CustomIcon type<span class=\"token operator\">=</span><span class=\"token string\">\"icon-store\"</span> size<span class=\"token operator\">=</span><span class=\"token string\">\"small\"</span><span class=\"token operator\">/</span><span class=\"token operator\">&gt;</span>\n        <span class=\"token operator\">&lt;</span>CustomIcon type<span class=\"token operator\">=</span><span class=\"token string\">\"icon-gift\"</span><span class=\"token operator\">/</span><span class=\"token operator\">&gt;</span>\n        <span class=\"token operator\">&lt;</span>CustomIcon type<span class=\"token operator\">=</span><span class=\"token string\">\"icon-pic\"</span> size<span class=\"token operator\">=</span><span class=\"token string\">\"large\"</span><span class=\"token operator\">/</span><span class=\"token operator\">&gt;</span>\n    <span class=\"token operator\">&lt;</span><span class=\"token operator\">/</span>div<span class=\"token operator\">&gt;</span>\n<span class=\"token punctuation\">,</span> mountNode<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n</code></pre>\n<!-- api-extra-end -->\n"}