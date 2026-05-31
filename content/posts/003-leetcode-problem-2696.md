+++
date = '2024-10-09T15:21:57+07:00'
draft = false
title = 'Leetcode Problem 2696'
slug = 'leetcode-problem-2696'
+++

Let's solve the problem 2696 from Leetcode: [Minimum String Length After Removing Substrings](https://leetcode.com/problems/minimum-string-length-after-removing-substrings/description/).

My initial thought for this problem is that this is a counting problem. We need to count all the possibility of removing the substring from the string. E.g: for the example "ABFCACDB", we can remove "AB" or "CD" first. Then so on and so forth, we will examine the next string after first removal. To me it's looks like a recursive problem. So I tried to solved it with a recursive:

```go
func deleteCharAtIndex(s string, index int, l int) string {
	var buffer bytes.Buffer
	for i := 0; i < len(s); i++ {
		if i >= index && i < index+l {
			continue
		}
		buffer.WriteString(string(s[i]))
	}

	return buffer.String()
}

func minLength(s string) int {
	for i := 0; i < len(s)-1; i++ {
		if s[i] == 'A' && s[i+1] == 'B' {
			subS := deleteCharAtIndex(s, i, 2)
			return minLength(subS)
		}
		if s[i] == 'C' && s[i+1] == 'D' {
			subS := deleteCharAtIndex(s, i, 2)
			return minLength(subS)
		}
	}
	return len(s)
}
```

This works but not efficient. As you can see, I have to do it recursively and have to create a new string every time I remove the substring. I realized that I don't really need to check every variation of removing the substring. For example, if we have "ABCD", we can remove "AB" first or "CD" first, the result will be the same regardless the "AB" or "CD" we remove first. So I come up with a better solution which using stack, basically we will construct a new string by pushing the character from original string to the stack. If the next character of the string and the top of the stack match "AB" or "CD", we will pop the stack and skip that character. Otherwise, we will push the character to the stack. After that, we will return the length of the stack which is the final result after remove all the substring "AB" and "CD".

```go
func minLengthOptimized(s string) int {
	stack := make([]rune, 0)
	for _, c := range s {
		if len(stack) > 0 {
			if c == 'B' && stack[len(stack)-1] == 'A' {
				stack = stack[:len(stack)-1]
				continue
			}
			if c == 'D' && stack[len(stack)-1] == 'C' {
				stack = stack[:len(stack)-1]
				continue
			}
		}
		stack = append(stack, c)
	}

	return len(stack)
}
```

I have a repository which contains all of my leetcode practice problems. You can find it [here](https://github.com/saldyy/leetcode).

