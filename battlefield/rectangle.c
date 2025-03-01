#include <stdio.h>

void printMultiple(char c, int n);

int main(){
    int width, height;
    puts("Enter the width and height of the rectangle, seperated by a space:");
    scanf("%d %d", &width, &height);

    printMultiple('*', width);
    putchar('\n');
    for (int i = 0; i < height - 2; i++){
        putchar('*');
        printMultiple(' ', width - 2);
        putchar('*');
        putchar('\n');
    }
    printMultiple('*', width);
    putchar('\n');
    return 0;
}

void printMultiple(char c, int n)
{
    for (int i = 0; i < n; i++)
    {
        putchar(c);
    }
}