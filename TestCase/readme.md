# React 测试用例

## 一、常见的测试框架

- Jest
- Enzyme
- Mocha全家桶（套餐内容大概率是：Mocha + Chai + Sinon + Istanbul）
- react-test-renderer
- react-dom/test-utils

### [Jest](https://jestjs.io/)

Jest 是 Facebook 开发的一款 JavaScript 测试框架。在 Facebook 内部广泛用来测试各种 JavaScript 代码。其官网上主要列出了以下几个特点：

- 轻松上手
  - 使用 create-react-app 或是 react-native init 创建的项目已经默认集成了 Jest
  - 现有项目，只需创建一个名为 __test__ 的目录，然后在该目录中创建以 .spec.js 或 .test.js 结尾的文件即可
- 内置强大的断言与 mock 功能
- 内置测试覆盖率统计功能
- 内置 Snapshot 机制

虽然 Jest 官网介绍中多次 React，但实际上 Jest 并不是和 React 绑定的。你可以使用它测试任何 JavaScript 项目。

### [Enzyme](https://airbnb.io/enzyme/)

由 Airbnb 出品。官方文档中给自己的定义是：

> Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and traverse your React Components’ output.

从这里可以看出两点信息：

- Enzyme 的定位是一个工具库
- Enzyme 的出现是为了让我们更方便的遍历、操作 React 组件输出的内容

### [Mocha](https://mochajs.org/)

Mocha 是另一个 JavaScript 测试框架。与 Jest 不同的是，它自身只提供作为一个测试框架最核心的功能。而其它增强功能，如丰富的断言语法、mock、测试覆盖率统计等功能则是通过各种 Add-ons 提供的。与各种 Add-ons 搭配在一起形成了各种各样的“套餐”。而最常见的组合应该就是如下这样的搭配：

- [Chai](https://www.chaijs.com/) 负责断言
- [Sinon.js](https://sinonjs.org/) 负责 mock
- [Istanbul](https://github.com/gotwarlost/istanbul) 负责统计测试覆盖率

### [react-test-renderer](https://reactjs.org/docs/test-renderer.html)

在说 react-test-renderer 之前，让我们先聊聊什么是 renderer。React 最早是被用来开发网页的，所以早期的 React 库中还包含了大量和 DOM 相关的逻辑。后来 React 的设计思想慢慢被迁移到其它场景，最被人们熟知的莫过于 React Native 了。为了灵活性和扩展性，React 的代码被分拆为 React 核心代码与各种 renderer。React 自带了 3 个 renderer，前两个是大家常见的：

- [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom) 负责将组建渲染到浏览器页面中。
- [react-native-renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) 负责将组件渲染成原生场景中的各种 “View”。

### [react-dom/test-utils](https://reactjs.org/docs/test-utils.html)

首先从名称可以看出这个库是包含在 react-dom 中的。所以它只是 react-dom 的辅助测试工具。在 React 文档站中它的介绍页上用的标题却只有 “Test Utilities” 两个单词，很容易让人产生误解。该库中的方法主要作用是帮我们遍历 ReactDOM 生成的 DOM 树，方便我们编写断言。注意：使用该库时必须提供一个 DOM 环境。当然这个 DOM 环境可以是 jsdom 这种模拟环境。(友情提示：Jest 默认的执行环境就是 jsdom)

`react-test-renderer` 和 `react-dom/test-utils` 两者看起来还是很相似。何时该选择哪一个库呢？

- 如果需要测试事件（如 click, change, blur 等），那么使用 react-dom/test-utils
- 其它时候使用更简单、灵活的 react-test-renderer

## 二、测试React组件之 render(), act() 方法

### render

该方法负责把ReactElement渲染到container中去，是单元测试中主要的渲染方法，要注意的是其内部会自动调用act方法保证副作用函数被执行，使用方式如下：

``` javascript
function render(
  ui: React.ReactElement,
  options?: {
    // 这里的参数看官网
  }
): RenderResult

// in test case

const el = render(<HelloWorld />);

const { container, getByText } = el;

```

### act

内部大致执行过程是: act(callback)会把 callback 丢给 batchedUpdates 处理，而 batchedUpdates 会合并多个 update，之后再调用 flushWork ，它的作用就是 flush effects；如果callback是异步函数或者是一个返回Promise的函数，则会调用flushWorkAndMicroTasks，它会flush effects，同时还会等待微队列执行完毕，因为异步函数await左边部分或者Promise回调函数都是加入微队列执行的。

### act 例子1

让我们从一个简单的组件开始。

``` javascript
function App() {
  let [ctr, setCtr] = useState(0);
  useEffect(() => {
    setCtr(1);
  }, []);
  return ctr;
}

ReactDOM.render(<App />, document.getElementById("app"));
```

``` javascript
it("should render 1", () => {
  const el = document.createElement("div");
  ReactDOM.render(<App />, el);
  expect(el.innerHTML).toBe("1"); // fails!
});
```

![1001](./img/1001.png)

> React 用 fiber 重写，当渲染时，React都不会“同步”呈现整个UI。它将工作分为几大块，并在调度程序中排队，所以这里并不会立刻执行 useEffect 里的代码。

在上面的组件中，正常的流程应该是：

- 第一次渲染输出 0
- 执行 effect 并将状态设置为 1
- 渲染并输出的位 1

![1002](./img/1002.png)

我们在React尚未完成UI更新的某个时间点运行测试 会导致与期望不符, 

- 通过使用 `useLayoutEffect` 而不是 `useEffect` : 虽然这可以通过测试，但我们不能为了测试用例而限制代码的写法。
- 通过等待一些时间（例如100毫秒左右）：很糟糕的方式。

在16.8.0中，我们引入了新的测试api act(...)。对于在其范围内运行的任何代码，它保证两件事：

- 任何状态更新将被执行
- 任何排队的效果将被执行

``` javascript
it("should render 1", () => {
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("1"); // this passes!
});
```
![1003](./img/1003.png)

### act 例子2

``` javascript
function App() {
  let [counter, setCounter] = useState(0);
  return <button onClick={() => setCounter(counter + 1)}>{counter}</button>;
}
```

``` javascript
it("should increment a counter", () => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  // we attach the element to document.body to ensure events work
  ReactDOM.render(<App />, el);
  const button = el.childNodes[0];
  for (let i = 0; i < 3; i++) {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
  expect(button.innerHTML).toBe("3");
});
```

``` javascript
act(() => {
  for (let i = 0; i < 3; i++) {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
expect(button.innerHTML).toBe(3);
```

上面两种测试用例的写法都会通过吗？
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---
---

act 的例子是 失败的。具体原因是:
> 如果处理程序彼此之间的调用接近，则 act 处理程序可能会使用陈旧数据并错过一些增量

解决方案：

- `setCounter(x => x + 1)` 这么书写的话代码应该会更加正确

- 写三个 act();
``` javascript 
act(() => {
  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
act(() => {
  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
act(() => {
  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});
```

### act 例子3 (计时器)

``` javascript
function App() {
  const [ctr, setCtr] = useState(0);
  useEffect(() => {
    setTimeout(() => setCtr(1), 1000);
  }, []);
  return ctr;
}
```

``` javascript
// fail
it("should tick to a new value", () => {
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  // ???
  expect(el.innerHTML).toBe("1");
});
```

#### 方法一：

``` javascript
// warning
it("should tick to a new value", () => {
  jest.useFakeTimers();
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  jest.runAllTimers();
  expect(el.innerHTML).toBe("1");
});
```

![1004](./img/1004.png)

当我们运行时runAllTimers()，组件中的超时问题解决了，触发了setState。但是还是会收到警告，提示我们需要 使用 act 将可能存在的异步操作包裹起来

``` javascript
// pass
it("should tick to a new value", () => {
  jest.useFakeTimers();
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  act(() => {
    jest.runAllTimers();
  });
  expect(el.innerHTML).toBe("1");
});
```

#### 方法二：

``` javascript
it("should tick to a new value", async () => {
  // a helper to use promises with timeouts
  function sleep(period) {
    return new Promise(resolve => setTimeout(resolve, period));
  }
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("0");
  await act(async () => {
    // wait *just* a little longer than the timeout in the component
    await sleep(1100); 
  });
  expect(el.innerHTML).toBe("1");
});
```

### act 例子4 (Promise)

``` javascript
function App() {
  let [data, setData] = useState(null);
  useEffect(() => {
    fetch("/some/url").then(setData);
  }, []);
  return data;
}
```

``` javascript
it("should display fetched data", () => {
  let resolve;
  function fetch() {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }

  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("");
  resolve(42);
  expect(el.innerHTML).toBe("42");
});
```

测试用例可以通过，但是还是会收到一个 warning 提示。Fix it

``` javascript
// ...
expect(el.innerHTML).toBe("");
await act(async () => {
  resolve(42);
});
expect(el.innerHTML).toBe("42");
// ...
```

### act 例子5 (async / await)

``` javascript
function App() {
  let [data, setData] = useState(null);
  async function somethingAsync() {
    let response = await fetch("/some/url");
    setData(response);
  }
  useEffect(() => {
    somethingAsync();
  }, []);
  return data;
}
```

``` javascript
it("should display fetched data", async () => {
  let resolve;
  function fetch() {
    return new Promise(_resolve => {
      resolve = _resolve;
    });
  }
  const el = document.createElement("div");
  act(() => {
    ReactDOM.render(<App />, el);
  });
  expect(el.innerHTML).toBe("");
  await act(async () => {
    resolve(42);
  });
  expect(el.innerHTML).toBe("42");
});
```

## 三、我推荐 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) 这个库

> 该库对 `react-test-renderer` 和 `react-dom/test-utils` 有较好封装，使用起来方便快捷，极大的减少了编写测试用例的时间。

## 四、踩过的坑

### 1. Jest 是`基于 Node.js 运行的`。即在 Node.js 运行时里面模拟浏览器 document 等 DOM api

![1005](./img/1005.png)

> 对于某些可以在 Node Browser 两个环境运行的包，jest 运行时会执行 node 环境下的代码，而我们实际测的应该是 Browser 环境下的代码，从而导致报错

解决办法：

![1006](./img/1006.png)

> 通过 Jest 配置项中的 moduleNameMapper 属性显示指定 某包 的 执行文件路径

### 2. 使用 jest-date-mock 功能 mock Date 对象

> 如果测试用例中有生成过 snapshot 快照，且快照代码里用用到 new Date(), 那么每天 跑测试用例生成的快照都是不一致大，导致今天通过的测试用例，明天就通过不了了。

``` javascript
// jest.config.ts
config.setupFiles = [
  '<rootDir>/testConfig/jest.setup.ts',
];
config.setupFilesAfterEnv = [
  '<rootDir>/testConfig/jest.setupEnv.ts',
];

// jest.setupEnv.ts
let sypDebug: jest.SpyInstance;
beforeAll(() => {
  // ignore debug
  sypDebug = jest.spyOn(window.console, 'debug');
  sypDebug.mockImplementation(() => null);
  // mock date to 2020-5-17
  advanceTo('2020-5-17');
});
afterAll(() => {
  // 消除对 debug 的代理
  sypDebug.mockRestore();
  // 消除对 Date 对象的代理
  clearDateMock();
});
```

### 3. 建议对项目的 root provider 统一管理, 便于代码的维护，更加便利测试用例的编写（可以统一维护，不需要一个一个单独的 Mock）

![1007](./img/1007.png)

![1008](./img/1008.png)

在我们以页面维度编写测试用例时，好处就体现出来了。我们只需要对 render 做一层包装，就可以方便快捷的测试任何一个子页面，而无需重复的编写 provider 的 mock.

``` javascript
/*
 * @Author: j.yangf
 * @Date: 2020-07-27 16:51:07
 * @LastEditTime: 2020-10-30 18:39:01
 * @LastEditors: j.yangf
 * @Description:
 * // 封装以下的写法
 * // const history = createMemoryHistory();
 * // history.push('/partners/report/booking');
 * // let el;
 * // await act(async () => {
 * //   el = await render((
 * //     <ProvideWarp>
 * //       <Router history={history}>
 * //         <Report />
 * //       </Router>
 * //     </ProvideWarp>
 * //   ));
 * // });
 * @FilePath: /partner-online/test/utils/renderWithRoot.tsx
 */
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import {
  Router,
} from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import ProvideWarp from 'src/providerWarp';

export interface RootRenderResType extends RenderResult {
  _history: MemoryHistory;
}
// test utils file
export function renderWithRoot(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
): RootRenderResType {
  const Wrapper = ({ children }) => (
    <Router history={history}>
      <ProvideWarp>
        {children}
      </ProvideWarp>
    </Router>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    _history: history,
  };
}
```

使用的时候如下，各种 useContext 的代码都能正常运行，无需关注 root 环境配置问题

``` javascript
describe('test', () => {
  it('test', async () => {
    const { default: App } = await import('src/pages/firstLogin/index');
    let el: RootRenderResType;
    await act(async () => {
      el = await renderWithRoot((<App />), {
        route: PageUrl.firstLogin, // '/partners/firstLogin' 页面url
      });
    });
  })
})
```

### 4. 异步 引入 App, 异步引入之前 mock 好基础数据（App 会读到的数据，例如 `window.__CONFIG__`）。 可使用 import 或 require

``` javascript
// 开头引入会导致后面 mock 的 __CONFIG__ 无法被正常读取
// 原因: import 是编译时执行，编译的时候就会读取 __CONFIG__ 了。所以要改写成 动态导入
// import App from 'src/pages/firstLogin/index'; 
describe('test', () => {
  beforeEach(() => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      ...MockConfig,
    };
  });
  it('uid 未成功注册 aid', async () => {
    // import App 之前 mock 好 __CONFIG__ 对象。
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      uid: mockUidForCheckState.none,
    };
    const { default: App } = await import('src/pages/firstLogin/index');
    let el: RootRenderResType;
    await act(async () => {
      el = await renderWithRoot((<App />), {
        route: PageUrl.firstLogin, // '/partners/firstLogin' 页面url
      });
    });
  });

  it('uid 成功注册 aid', async () => {
    // import App 之前 mock 好 __CONFIG__ 对象。
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      uid: mockUidForCheckState.ok,
    };
    const { default: App } = await import('src/pages/firstLogin/index');
    let el: RootRenderResType;
    await act(async () => {
      el = await renderWithRoot((<App />), {
        route: PageUrl.firstLogin, // '/partners/firstLogin' 页面url
      });
    });
  })
})
```

### 5. 设置超时时间

> it 内部逻辑多的时候 (一个 it 测试了多个异步不走，含多个 act)，可能会超时（3000ms）, 可在 jest.setupEnv.ts 中配置 超时时间

![1009](./img/1009.png)

### 6. 使用 debug 模式 (无界面写测试用例简直是灾难)

> testing-library 库中的 debug 方法可以随时查看当前的 element 的快照。注意：需要额外的配置，否则只能查看少数的几十行。

Demo:

``` javascript
it('Render page BookingReport test test page change option', async () => {
  let el;
  await act(async () => {
    el = await renderWithRoot((
      <ReportProviderWarp>
        <BookingReport />
      </ReportProviderWarp>
    ), {
      route: PageUrl._report.booking,
    });
  });
  const { container } = el;
  const table = container.querySelector('table');
  expect(table).not.toBe(null);
  // 寻找 page 2 按钮
  const pageC = el.getByTestId('base-pagination');
  // el.debug(pageC);
  const allPageBtn = Array.from(pageC.querySelectorAll('button'));
  const page2Btn = allPageBtn.find((item) => item.textContent === '2');

  // 打印找到的 按钮， 若为空会打印整个 body, 可以在 body 中看整个dom
  el.debug(page2Btn);
  
  expect(page2Btn).toBeDefined();
  await act(async () => {
    fireEvent.click(page2Btn);
  });
  const page2TrArr = table.querySelectorAll('tbody tr');
  expect(page2TrArr.length).toBe(mockListDataPage2.allianceOrderList.length);
});
```

![1010](./img/1010.png)

额外的配置：使其最多可打印 100000 行，同时你的控制台也需要设置，不然控制台只支持 1k 行也是不够的

``` javascript
// package.json
"scripts": {
  "test": "jest",
  "test:update": "npm run test -- --updateSnapshot",
  "test:coverage": "npm run test -- --coverage",
  "test:ci": "jest --coverage --json --outputFile=./coverage/test-result.json",

  "test:debug": "DEBUG_PRINT_LIMIT=100000 npm run test -- --updateSnapshot --coverage",
},
```

### 7. 测试用例越来越多? 速度越来越来慢? `collectCoverageFrom` and `testMatch` 解救你

``` javascript
// 默认配置
config.collectCoverageFrom = [
  '<rootDir>/app/ad/**/*.{ts,tsx,js,jsx}',
  '<rootDir>/app/views/**/*.{ts,tsx,js,jsx}',
];
// debug 时指定测哪些目录下文件的覆盖率情况
const _collectCoverageFrom = [
  // '<rootDir>/app/views/src/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/common/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/report/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/account/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/tools/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/tools/staticbanner/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/tools/dynamicBanner/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/tools/searchBox/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/tools/ApiTool/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/dashboard/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/faq/**/*.{ts,tsx,js,jsx}',
  // '<rootDir>/app/views/src/pages/firstLogin/**/*.{ts,tsx,js,jsx}',
];
// debug 时指定测哪个 test case 文件
const _testMatch = [
  // '<rootDir>/test/ap/pages/tools/**/?(*.)+(spec|test).[jt]s?(x)',
  // '<rootDir>/test/ap/pages/tools/staticbanner.test.tsx',
  // '<rootDir>/test/ap/pages/report/paymentVoucher.test.js',
  // '<rootDir>/test/ap/pages/tools/dynamicbanner.test.tsx',
  // '<rootDir>/test/ap/pages/tools/apitool.test.tsx',
  // '<rootDir>/test/ap/pages/tools/searchbox.test.tsx',
  // '<rootDir>/test/ap/pages/dashboard/index.test.tsx',
  // '<rootDir>/test/ap/pages/faq/index.test.tsx',
  '<rootDir>/test/ap/pages/firstLogin/index.test.tsx',
];

if (_collectCoverageFrom.length > 0) config.collectCoverageFrom = _collectCoverageFrom;
if (_testMatch.length > 0) config.testMatch = _testMatch;
```



