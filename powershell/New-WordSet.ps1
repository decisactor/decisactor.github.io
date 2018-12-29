. C:\GitHub\powershell\Utility.ps1

function Get-Definition ($word) {

    $document = Get-Html "https://en.oxforddictionaries.com/definition/us/$word"

    # defintion
    foreach ($definition in $document.getElementsByClassName("ind")) {
        $definitions += $definition.outerHtml -replace "SPAN", "p"
    }

    # example
    foreach ($example in $document.getElementsByClassName("examples")) {
        $sentences = @()
        foreach ($sentence in $example.getElementsByClassName("ex")) {
            $sentences += , $sentence.innerText -replace "[\u2018-\u2019]"
        }
        $examples += "<p>" + ($sentences | Sort-Object Length | Select-Object -Last 1) + "</p>"
    }

    # synonym
    foreach ($synonym in $document.getElementsByClassName("exs")) {
        $synonyms += $synonym.outerHtml
    }

    # etymology
    if ($document.querySelector(".etymology")) {
        $etymology = $document.querySelector(".etymology p").outerHTML
    }

    # get synonyms from the free dictionary if Oxford has not
    $document = Get-Html "https://www.thefreedictionary.com/$word"
    $synonyms += "`n<div class=syn>"
    foreach ($synonym in $document.querySelector("#ThesaurusInner").getElementsByClassName("Syn")) {
        if ($synonym.innerText -notmatch "," -or $synonym.innerText -match "=") { continue }
        $content = $synonym.getElementsByTagName("a") | ForEach-Object { 
            if (!$synonyms.Contains($_.innerText)) { $_.innerText } 
        }
        $synonyms += ($content -join ", ") + ", "
    }
    $synonyms = $synonyms.TrimEnd(", ").Replace("'", "").ToLower() + "</div>"
    $synonyms = $synonyms -replace "((?<=>)| )\w+([ -]\w+)+(,|(?=<))"
    $synonyms = $synonyms -replace ",(?=<)|<strong></strong>,? ?|(?<=syn>)," 
    $synonyms = $synonyms -replace "<div.*exs`"></div>|<div class=syn>\(.*\)</div>|(?<=(`"|n)>) (?=\w+)"
    $synonyms = $synonyms -replace "strong>", "b>" 

    $etymology += "<p>" + $document.querySelector(".etyseg").innerHTML + "</p>"
    $etymology = $etymology -replace "</?[A-Z]+.*?>"
    $etymology = $etymology -replace "<A.*?>(.*?)</A>", "<b>`$1</b>"
    $etymology = $etymology -replace "(<i.*?>.*?</i>)", "<b>`$1</b>"
    $etymology = $etymology -replace "<span.*?>(.*?)</span>", "`$1"
    $etymology = $etymology.ToLower()
    
    New-Object PSObject -Property @{
        word        = $word; 
        examples    = $examples; 
        definitions = $definitions; 
        synonyms    = $synonyms;
        etymology   = $etymology
    }
}

function Get-WordFamily ($word) {

    function Get-Children($Parent, $family) {
        $words = @()
        $words = $members.Where{$_.Parent -eq $Parent}.Word
        if (!$words) { return $family}
        if ($null -eq $Parent) {$Parent = ""}
        foreach ($word in $words) {
            $family = $family.Insert(($family.IndexOf($Parent) + $Parent.Length), "<ul><li>$word</li></ul>")
            $family = Get-Children $word $family
        }
        $family
    }

    $members = @()
    $html = Get-Html "https://www.vocabulary.com/dictionary/$word"
    $members = $html.querySelector("[data]").getAttribute("data") | ConvertFrom-Json

    Get-Children $null ""
}

function Set-WordSet ($id) {

    if (!$id) { return }
    
    Write-Host "`n$id"
    if ($id.GetType().Name -eq "String") {
        $list = $html.querySelector("#$id").innerHTML.Split(" ")
    }
    else {
        $list = $id
    }
    $set = New-Object PSObject -Property @{name = $id}

    $words = @()
    foreach ($word in $list) {
        if (!$word) { continue }
        Write-Host $word
        $family = Get-WordFamily $word
        $word = Get-Definition $word
        $word | Add-Member family $family
        $words += $word
    }

    $set | Add-Member words $words

    $sets = ConvertFrom-Json ((Get-Content C:\github\js\literals\words.js -Raw) -replace "sets = ")
    #$sets.ForEach{ $_.Name = $_.Name.ToLower().Replace(" ", "-") }
    if ($sets -and $sets.Name.Contains($set.Name)) { $sets[$sets.Name.IndexOf($set.Name)] = $set } 
    else { $sets += , $set }

    # format json to js
    $content = "sets = " + (ConvertTo-Json $sets) 
    $details = ($sets[0].words[0] | Get-Member -MemberType NoteProperty).Name
    foreach ($detail in $details) { $content = $content -replace "$detail=", "`"$detail`"`:`"" }
    $content = $content -replace ",`r`n\s+`"Count`".*`r`n}|{`r`n\s+`"value`":|\\u0026lt; "
    $content = $content -replace "; `"", "`", `"" -replace "`"@{", "{" -replace "}`"", "`"}"
    $content = $content -replace "`"(\w+)`":", "`$1:" -replace "\\u003e", ">" -replace "\\u003c", "<"
    $content = $content -replace "\\u0027", "'"

    if ($id.GetType().Name -eq "String") { 
        Set-Content C:\github\js\literals\words.js $content -Encoding UTF8}
}

#$id = "mp-example"
$html = Get-Html (Get-Content "C:\github\gre\notes\vocabulary.html" -Raw)
$html.getElementsByTagName("div") | ForEach-Object { Set-WordSet $_.id }
#Set-WordSet "genuflect hone".Split(' ')
