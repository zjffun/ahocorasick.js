tests=('00' '13' '28')
code=1

for t in ${tests[@]}
do
    res=$(node ./test/test.js < ./test/input$t.txt)
    ans=$(< ./test/output$t.txt)

    if test "$res" != "$ans"
    then
        code=2
        echo fail! res = $res ans = $ans
    fi
done

exit $((code))