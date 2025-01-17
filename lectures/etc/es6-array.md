# ES6 배열 함수

ES6에서는 배열을 더 효과적으로 다룰 수 있는 여러 가지 새로운 메서드들이 도입되었습니다. 이 메서드들은 함수형 프로그래밍 패러다임을 JavaScript에 더 쉽게 적용할 수 있게 해줍니다.

## 1. map()

`map()` 메서드는 배열의 모든 요소에 대해 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환합니다.

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]
```

C#에서는 `Select()` 메서드가 이와 유사한 기능을 합니다.

## 2. filter()

`filter()` 메서드는 주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환합니다.

```javascript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]
```

C#에서는 `Where()` 메서드가 이와 유사한 기능을 합니다.

## 3. reduce()

`reduce()` 메서드는 배열의 각 요소에 대해 주어진 리듀서(reducer) 함수를 실행하고, 하나의 결과값을 반환합니다.

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 10
```

C#에서는 `Aggregate()` 메서드가 이와 유사한 기능을 합니다.

## 4. find()

`find()` 메서드는 주어진 판별 함수를 만족하는 첫 번째 요소의 값을 반환합니다.

```javascript
const numbers = [1, 2, 3, 4, 5];
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2
```

C#에서는 `FirstOrDefault()` 메서드가 이와 유사한 기능을 합니다.

## 5. findIndex()

`findIndex()` 메서드는 주어진 판별 함수를 만족하는 첫 번째 요소의 인덱스를 반환합니다.

```javascript
const fruits = ['apple', 'banana', 'cherry'];
const index = fruits.findIndex(fruit => fruit === 'banana');
console.log(index); // 1
```

C#에서는 `FindIndex()` 메서드가 이와 동일한 기능을 합니다.

## 6. some()

`some()` 메서드는 배열 안의 어떤 요소라도 주어진 판별 함수를 통과하는지 테스트합니다.

```javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true
```

C#에서는 `Any()` 메서드가 이와 유사한 기능을 합니다.

## 7. every()

`every()` 메서드는 배열 안의 모든 요소가 주어진 판별 함수를 통과하는지 테스트합니다.

```javascript
const numbers = [2, 4, 6, 8];
const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // true
```

C#에서는 `All()` 메서드가 이와 유사한 기능을 합니다.

이러한 배열 함수들은 React 개발에서 매우 자주 사용되며, 특히 상태 업데이트나 데이터 변환 시 유용하게 활용됩니다. 이 함수들을 잘 활용하면 더 간결하고 읽기 쉬운 코드를 작성할 수 있으며, 불변성을 유지하면서 데이터를 처리할 수 있습니다.

## 실제 사용 예시

다음은 이러한 함수들을 실제 데이터로 활용하는 예시입니다:

```javascript
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 },
  { name: 'David', age: 40 }
];

// map(): 모든 사람의 이름을 배열로 만들기
const names = people.map(person => person.name);
console.log(names); // ['Alice', 'Bob', 'Charlie', 'David']

// filter(): 30세 이상인 사람들만 필터링하기
const over30 = people.filter(person => person.age >= 30);
console.log(over30); // [{ name: 'Bob', age: 30 }, { name: 'Charlie', age: 35 }, { name: 'David', age: 40 }]

// reduce(): 모든 사람의 나이의 합 구하기
const totalAge = people.reduce((sum, person) => sum + person.age, 0);
console.log(totalAge); // 130

// find(): 'Bob'이라는 이름을 가진 사람 찾기
const bob = people.find(person => person.name === 'Bob');
console.log(bob); // { name: 'Bob', age: 30 }

// some(): 20세 이상인 사람이 있는지 확인하기
const hasOver20 = people.some(person => person.age >= 20);
console.log(hasOver20); // true

// every(): 모든 사람이 25세 이상인지 확인하기
const allOver25 = people.every(person => person.age >= 25);
console.log(allOver25); // true
```

이러한 예시들은 실제 데이터 처리 상황에서 ES6 배열 함수들이 어떻게 사용될 수 있는지를 보여줍니다. C#의 LINQ와 유사한 방식으로 데이터를 처리할 수 있어, C# 개발자들이 JavaScript로 전환할 때 익숙하게 느낄 수 있습니다.