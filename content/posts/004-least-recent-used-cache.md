+++
date = '2024-10-13T15:27:14+07:00'
draft = false
title = 'Least Recent Used Cache'
slug = 'least-recent-used-cache'
+++

Recently, I encountered an interesting problem in Leetcode, which is [LRU Cache](https://leetcode.com/problems/lru-cache/description/). This is not a normal **LRU Cache** that I'm familiar with. It has some twists which is:
- We have to evict the least used key if the size of the cache exceeds the predefine capacity.
- Every time we access a key, it counted as used, we will have to find a way to reaarange the order of the key in the cache.
- The **get** and **put** operation must have **O(1)** complexity.

First, let analize this. For normal **LRU Cache**, we only need to use a map to track the key and value. But with this problem, we need to track the order of the key based on when was it get accessed. If we loop through the whole key list, it will violate the constraint **O(1)** complexity, so this is not a viable option. I noticed that, we need to keep track the order of the accessed key. The best way I can think of is using Linked List in this case because of that reason. However, if we use Linked List, in the scenario that we access the the Node in the middle of the list, we will have to move this Node to head and connect the previous Node with the next Node. The traditional way of Linked List doesn't support the behavior of tracking previous Node. Therefore, we will use the 2 way Linked List to track both Previous Node and Next Node.
![double linked list](/assets/images/article-004/double-linked-list.png)
For each Node, we will store both value and key to help tracking it easier.
We will still have a map like a normal **LRU Cache** to keep track on what's being stored. The biggest difference is that instead of storing the value for each key, we will store the Node for each key.
Let examine what we have to do for each operation
1. **Get** operation
- Obviously, if we don't find it in the cache, we will return -1.
- If we found the key in the cache, we will move the Node corresponding to the head of the Linked List.
2. **Put** operation
- If we found the key in cache, we will have to update the value of the Node and move that Node to the head of the Linked List.
- If we **DON'T** found the key in cache, we will add a new Node to the head of the cache and double check if the cache size exceeds the capacity or not. If yes then we will remove the tail Node.

Here is my implementation:
```go
type Node struct {
	Value int
	Key   int
	Prev  *Node
	Next  *Node
}

type LRUCache struct {
	capcity int
	cache   map[int]*Node
	tail    *Node
	head    *Node
}

func (this *Node) ToString() string {
	var s strings.Builder
	tail := this
	for tail != nil {
		s.WriteString(fmt.Sprintf("(%d, %d) -> ", tail.Key, tail.Value))
		tail = tail.Next
	}

	return s.String()
}

func (this *Node) ToStringReverse() string {
	var s strings.Builder
	head := this
	for head != nil {
		s.WriteString(fmt.Sprintf("(%d, %d) <- ", head.Key, head.Value))
		head = head.Prev
	}

	return s.String()
}

func Constructor(capacity int) LRUCache {
	return LRUCache{capcity: capacity, cache: make(map[int]*Node), head: nil, tail: nil}
}

func (this *LRUCache) PrintCacheKey() {
	for k, _ := range this.cache {
		fmt.Printf("Cache key: %d, ", k)
	}
	fmt.Println()
}

func (this *LRUCache) PrintList() {
	fmt.Printf("Head key %d, value: %d\n", this.head.Key, this.head.Value)
	fmt.Printf("Tail key %d, value: %d\n", this.tail.Key, this.tail.Value)
	fmt.Printf("List: %v\n", this.tail.ToString())
	fmt.Printf("List Reverse: %v\n", this.head.ToStringReverse())
}

func (this *LRUCache) addToNode(key int, value int) {
	this.cache[key] = &Node{Value: value, Key: key, Prev: this.head, Next: nil}
	if len(this.cache) == 1 {
		this.tail = this.cache[key]
	}
	if this.head != nil {
		this.head.Next = this.cache[key]
	}
	this.head = this.cache[key]
}

func (this *LRUCache) moveToHead(key int) {
	// If key is head node, return
	if this.head == this.cache[key] {
		return
	}

	// In case of key is tail node
	if this.tail == this.cache[key] {
		// Update tail to next to tail
		this.tail = this.cache[key].Next
		this.tail.Prev = nil
		// Update head with current cache[key]
		this.head.Next = this.cache[key]
		this.cache[key].Prev = this.head
		this.cache[key].Next = nil
		this.head = this.cache[key]
		return
	}

	// Link Prev Node with Next Node
	this.cache[key].Prev.Next = this.cache[key].Next
	this.cache[key].Next.Prev = this.cache[key].Prev

	// Update Head Node
	this.head.Next = this.cache[key]
	this.cache[key].Prev = this.head
	this.cache[key].Next = nil
	this.head = this.cache[key]
}

func (this *LRUCache) removeTailNode() {
	delete(this.cache, this.tail.Key)
	nextFromTail := this.tail.Next
	nextFromTail.Prev = nil
	this.tail = nextFromTail
}

func (this *LRUCache) Get(key int) int {
	if this.cache[key] == nil {
		return -1
	}

	this.moveToHead(key)

	return this.cache[key].Value
}

func (this *LRUCache) Put(key int, value int) {
	// Handle if the current key is already set
	if this.cache[key] != nil {
		this.cache[key].Value = value	
		this.moveToHead(key)
		return
	}

	this.addToNode(key, value)
	if len(this.cache) > this.capcity {
		this.removeTailNode()
	}
}
```
I have a repository which contains all of my leetcode practice problems. You can find it [here](https://github.com/saldyy/leetcode).
